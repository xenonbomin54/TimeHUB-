# TimeHub

<img width="1920" height="962" alt="스크린샷 2026-07-16 오전 12 10 05" src="https://github.com/user-attachments/assets/f5858a8e-2632-4700-adb9-1369f9c3faa6" />

> 로그인 없이 링크 하나로 모두의 가능한 시간을 모아 최적의 모임 시간을 찾는 일정 조율 서비스

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite)

## 프로젝트 소개

TimeHub는 여러 사람의 가능한 시간을 쉽고 빠르게 조율하기 위한 웹 서비스입니다.

방을 생성한 뒤 링크를 공유하면 참여자들이 자신의 불가능한 시간을 체크하고, TimeHub가 모든 참여자의 일정을 종합하여 가장 적합한 시간을 추천합니다.

회원가입이나 로그인 없이 바로 사용할 수 있어 소규모 모임, 팀 프로젝트, 스터디 등에서 빠르게 사용할 수 있습니다.

---

## 주요 기능

### 방 생성

- 모임 이름 설정
- 요일 선택
- 시간 범위 설정
- 공유 가능한 고유 코드 생성

### 참여

- 링크 또는 코드로 참여
- 닉네임 입력
- 불가능한 시간 선택

### 실시간 일정 분석

- 참여자의 일정 자동 집계
- 히트맵으로 가용 시간 시각화
- 가능한 인원 수 표시

### 추천 시간

- 가장 많은 인원이 가능한 시간 자동 추천
- 참여 가능한 인원 목록 제공

### 간편 공유

- 링크 복사
- 방 코드 공유
- 로그인 없이 즉시 참여 가능

---

## 화면

| 메인 | 일정 확인 |
|------|-----------|
| (스크린샷 추가) | (스크린샷 추가) |

---

##  기술 스택

### 프론트엔드

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS

### 백엔드

- Firebase Firestore

### 배포

- Firebase Hosting

---

## 추천 알고리즘

각 참여자는 **가능한 시간**이 아닌 **불가능한 시간**만 선택합니다.

이후 모든 참여자의 데이터를 종합하여 시간별 가능한 인원을 계산합니다.

이를 통해 가능 인원이 가장 많은 시간을 추천합니다.

---

## 프로젝트 목표

- 일정 조율의 번거로움 최소화

- 로그인 없는 빠른 사용 경험
- 직관적인 일정 시각화
- 모바일 환경에서도 간편한 사용

---

## 기여자

- 김보민  
- 최선우
