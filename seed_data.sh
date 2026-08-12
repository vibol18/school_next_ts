#!/bin/bash
# Seed script to populate the Spring Boot backend with test data
set -e

API="http://localhost:8080"

echo "=== 1. Getting auth token ==="
LOGIN_RESP=$(curl -s "$API/api/auth/login" -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"Admin123!"}')
TOKEN=$(echo "$LOGIN_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])")
AUTH="Authorization: Bearer $TOKEN"
echo "Token acquired."

echo ""
echo "=== 2. Register teacher and student users ==="
# Register teacher users
for i in 1 2 3 4 5; do
  curl -s "$API/api/auth/register" -H "Content-Type: application/json" \
    -d "{\"username\":\"teacher$i\",\"email\":\"teacher$i@school.edu\",\"password\":\"Teacher123!\",\"role\":\"TEACHER\"}" > /dev/null
done
echo "  5 teacher users registered."

# Register student users
for i in 1 2 3 4 5 6 7 8; do
  curl -s "$API/api/auth/register" -H "Content-Type: application/json" \
    -d "{\"username\":\"student$i\",\"email\":\"student$i@school.edu\",\"password\":\"Student123!\",\"role\":\"STUDENT\"}" > /dev/null
done
echo "  8 student users registered."

echo ""
echo "=== 3. Create Academic Year ==="
curl -s "$API/api/academic-years" -H "Content-Type: application/json" -H "$AUTH" \
  -d '{"yearName":"2025-2026","startDate":"2025-09-01","endDate":"2026-06-30","current":true}' | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'  Created: {d.get(\"yearName\",d)}')" 2>/dev/null || echo "  Academic year may already exist."

curl -s "$API/api/academic-years" -H "Content-Type: application/json" -H "$AUTH" \
  -d '{"yearName":"2024-2025","startDate":"2024-09-01","endDate":"2025-06-30","current":false}' | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'  Created: {d.get(\"yearName\",d)}')" 2>/dev/null || echo "  Academic year may already exist."

echo ""
echo "=== 4. Create Classes ==="
classes=("Grade 1:G1" "Grade 2:G2" "Grade 3:G3" "Grade 4:G4" "Grade 5:G5" "Grade 6:G6")
for entry in "${classes[@]}"; do
  IFS=':' read -r name code <<< "$entry"
  curl -s "$API/api/classes" -H "Content-Type: application/json" -H "$AUTH" \
    -d "{\"name\":\"$name\",\"code\":\"$code\"}" > /dev/null
  echo "  Created class: $name"
done

echo ""
echo "=== 5. Create Sections ==="
# Create sections for class 1,2,3 (IDs likely 1,2,3)
for classId in 1 2 3; do
  for section in "A" "B"; do
    curl -s "$API/api/sections" -H "Content-Type: application/json" -H "$AUTH" \
      -d "{\"name\":\"Section $section\",\"classId\":$classId}" > /dev/null
    echo "  Created Section $section for class $classId"
  done
done

echo ""
echo "=== 6. Create Subjects ==="
subjects=("Mathematics:MATH101" "English:ENG101" "Science:SCI101" "History:HIS101" "Geography:GEO101" "Art:ART101" "Physical Education:PE101" "Computer Science:CS101")
for entry in "${subjects[@]}"; do
  IFS=':' read -r name code <<< "$entry"
  curl -s "$API/api/subjects" -H "Content-Type: application/json" -H "$AUTH" \
    -d "{\"name\":\"$name\",\"code\":\"$code\"}" > /dev/null
  echo "  Created subject: $name"
done

echo ""
echo "=== 7. Create Teachers ==="
teachers=(
  '{"employeeId":"EMP-001","qualification":"M.Sc Mathematics","experienceYears":"8","dateOfJoining":"2020-03-15"}'
  '{"employeeId":"EMP-002","qualification":"B.Ed English","experienceYears":"5","dateOfJoining":"2021-06-01"}'
  '{"employeeId":"EMP-003","qualification":"Ph.D Physics","experienceYears":"12","dateOfJoining":"2018-01-10"}'
  '{"employeeId":"EMP-004","qualification":"M.A History","experienceYears":"6","dateOfJoining":"2022-08-20"}'
  '{"employeeId":"EMP-005","qualification":"B.Sc Computer Science","experienceYears":"3","dateOfJoining":"2023-09-01"}'
)
for t in "${teachers[@]}"; do
  resp=$(curl -s "$API/api/teachers" -H "Content-Type: application/json" -H "$AUTH" -d "$t")
  echo "  Created teacher: $(echo "$resp" | python3 -c "import sys,json; print(json.load(sys.stdin).get('employeeId','?'))" 2>/dev/null || echo '?')"
done

echo ""
echo "=== 8. Create Students ==="
students=(
  '{"username":"s_aiden","email":"aiden@school.edu","password":"Student123!","firstName":"Aiden","lastName":"Cole","admissionNumber":"ADM-2025-001","dateOfBirth":"2012-03-15","gender":"MALE"}'
  '{"username":"s_maya","email":"maya@school.edu","password":"Student123!","firstName":"Maya","lastName":"Chen","admissionNumber":"ADM-2025-002","dateOfBirth":"2013-07-22","gender":"FEMALE"}'
  '{"username":"s_noah","email":"noah@school.edu","password":"Student123!","firstName":"Noah","lastName":"Patel","admissionNumber":"ADM-2025-003","dateOfBirth":"2011-11-08","gender":"MALE"}'
  '{"username":"s_sofia","email":"sofia@school.edu","password":"Student123!","firstName":"Sofia","lastName":"Reyes","admissionNumber":"ADM-2025-004","dateOfBirth":"2014-01-30","gender":"FEMALE"}'
  '{"username":"s_liam","email":"liam@school.edu","password":"Student123!","firstName":"Liam","lastName":"Johnson","admissionNumber":"ADM-2025-005","dateOfBirth":"2012-09-12","gender":"MALE"}'
  '{"username":"s_emma","email":"emma@school.edu","password":"Student123!","firstName":"Emma","lastName":"Williams","admissionNumber":"ADM-2025-006","dateOfBirth":"2013-04-05","gender":"FEMALE"}'
  '{"username":"s_oliver","email":"oliver@school.edu","password":"Student123!","firstName":"Oliver","lastName":"Brown","admissionNumber":"ADM-2025-007","dateOfBirth":"2011-12-18","gender":"MALE"}'
  '{"username":"s_ava","email":"ava@school.edu","password":"Student123!","firstName":"Ava","lastName":"Davis","admissionNumber":"ADM-2025-008","dateOfBirth":"2014-06-25","gender":"FEMALE"}'
)
for s in "${students[@]}"; do
  resp=$(curl -s "$API/api/students" -H "Content-Type: application/json" -H "$AUTH" -d "$s")
  name=$(echo "$resp" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"{d.get('firstName','?')} {d.get('lastName','')}\")" 2>/dev/null || echo "?")
  echo "  Created student: $name"
done

echo ""
echo "=== 9. Create Events ==="
events=(
  '{"title":"Parent-Teacher Meeting","description":"Annual parent-teacher conference to discuss student progress and academic goals","eventDate":"2026-08-15","location":"Main Auditorium","organizer":"Administration"}'
  '{"title":"Mid-Term Examinations","description":"Mid-term exams for all grades begin. Please ensure all students are prepared.","eventDate":"2026-08-25","location":"Examination Hall","organizer":"Academic Department"}'
  '{"title":"Annual Sports Day","description":"Inter-house sports competition featuring athletics, swimming, and team sports","eventDate":"2026-09-10","location":"Sports Ground","organizer":"Physical Education Dept"}'
  '{"title":"Science Fair 2026","description":"Students showcase innovative science projects and compete for awards","eventDate":"2026-09-20","location":"Science Lab Building","organizer":"Science Department"}'
)
for e in "${events[@]}"; do
  resp=$(curl -s "$API/api/events" -H "Content-Type: application/json" -H "$AUTH" -d "$e")
  echo "  Created event: $(echo "$resp" | python3 -c "import sys,json; print(json.load(sys.stdin).get('title','?'))" 2>/dev/null || echo '?')"
done

echo ""
echo "=== 10. Verify Data ==="
echo -n "  Students: "; curl -s "$API/api/students" -H "$AUTH" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null
echo -n "  Teachers: "; curl -s "$API/api/teachers" -H "$AUTH" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null
echo -n "  Classes:  "; curl -s "$API/api/classes" -H "$AUTH" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null
echo -n "  Subjects: "; curl -s "$API/api/subjects" -H "$AUTH" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null
echo -n "  Events:   "; curl -s "$API/api/events" -H "$AUTH" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null

echo ""
echo "=== SEEDING COMPLETE ==="
echo "Login credentials: admin / Admin123!"
