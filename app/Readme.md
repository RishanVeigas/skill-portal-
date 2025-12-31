## Peer Skill Exchange Platform

## Problem Statement

In a college environment, students possess diverse skills but lack a structured and reliable platform to discover peers, exchange skills, and collaborate effectively. Existing platforms are either too generic, informal, or focused on professional networking rather than peer-to-peer academic skill sharing. As a result, students struggle to find the right peers to learn from or collaborate with in an organized manner.

## Proposed Solution

The Peer Skill Exchange Platform addresses this problem by providing a dedicated, college-focused web application where students can:

* Create profiles showcasing skills they offer and skills they want to learn
* Discover relevant peers using skill-based matching
* Send structured skill exchange requests instead of informal messages
* Approve or reject collaboration requests through a clear workflow
* The platform ensures that all interactions are authenticated, structured, and purposeful, making peer learning   more  efficient and reliable.

## Solution Highlights

* Skill-Based Discovery: Automatically matches students based on overlapping skill needs and offerings
* Structured Requests: Formal request system with pending, accepted, and rejected states
* Secure Environment: Access restricted to authenticated users

## Features

* User Authentication

--Email & password login using Firebase Authentication
--Email verification enabled

* Profile Management

--Single profile page for profile creation and updates
--Users can add offered and requested skills

* Smart Skill Matching

--Automatically suggests best peer matches based on overlapping skills
--Match scoring for relevance ranking

* Peer Discovery Dashboard

--Search users by skills
--View peer profiles

## Tech Stack

-- Frontend: Next.js (App Router), React
-- Styling: Tailwind CSS
-- Backend / Database: Firebase Firestore
-- Authentication: Firebase Authentication

## Project structure

app/
 ├── dashboard/
 ├── profile/
 ├── profile/[uid]/
 ├── send-request/[uid]/
 ├── requests/
 ├── login/
 ├── register/
firebase/
 └── firebase.js

🎓 Outcome

The system enables students to efficiently connect with the right peers, promotes collaborative learning, and provides a practical solution to skill-sharing challenges within a college ecosystem.