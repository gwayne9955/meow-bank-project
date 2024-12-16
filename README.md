# meow-bank-project
Bank Project for Meow

### Objective
Your objective is to build a full-stack application for a fake financial institution using a language of your choice, you may use an API framework of your choice if you’d like.

### Brief
While modern banks have evolved to serve a plethora of functions, at their core, banks must provide certain basic features. Today, your task is to build the basic webapp for one of those banks! Imagine you are designing an administrative application for bank employees. You should build a backend API that ultimately be consumed by multiple frontends (web, iOS, Android etc). 

### Tasks
There should be API routes and functionality that allow them to:
Create a new bank account for a customer, with an initial deposit amount. A single customer may have multiple bank accounts.
Transfer amounts between any two accounts, including those owned by different customers.
Retrieve balances for a given account.
Retrieve transfer history for a given account.

## What I built
I built a web application using Python/FastAPI, PostgreSQL, and React/Typescript/Chakra UI. It maintains a well organized project structure. It uses docker compose as it's method of deployment locally, which makes it really easy to configure/port/run.

## Bonus Features I Included
1. Searching for accounts by name or Id
2. Sorting accounts by multiple columns
3. "Soft" deleting accounts, ignored from search but still accessible via the ID
4. Adding notes to an account or transfer
5. Error handling and validation
6. Currencies

## Stuff I Would Have Added Given More Time
1. Tests. I was testing manually for the sake of time but unit tests at least for the backend would be really helpful to make sure everything is working especially when introducing new changes
2. Authentication (users/employees, login page, token based auth, protected resources, etc)
3. Customers? It seemed out of scope to me, but could be cool to add and assign accounts to customers, etc.
4. Paging on search, didn't feel needed for this small project but if you scale then obviously an infinite scroll of accounts and transfers won't work
5. Search filters in the url themselves, this could help with navigation
6. Filtering search on other columns besides name/id (balance > $100 for example)
7. Caching, both backend and frontend
8. A proper text search engine with indexing, when searching for accounts by name
9. A more advanced chakra theme. I just went with one of their defaults for sake of time
10. Foreign exchange transfers between accounts of different base currencies. Get rates from [exchangerateapi.com](https://www.exchangerate-api.com/)

## Steps to Run
1. Install docker desktop
2. Clone this repo
4. From the project root directory, run `docker build && docker compose up`
5. Visit `http://localhost:3000`

<img width="1543" alt="Screenshot 2024-12-14 at 10 21 22 PM" src="https://github.com/user-attachments/assets/279fa21a-96d0-432e-bc03-2a2815738204" />
<img width="1541" alt="Screenshot 2024-12-15 at 2 46 52 PM" src="https://github.com/user-attachments/assets/f01ab3f0-28ac-4789-b783-7728e158609a" />
<img width="1537" alt="Screenshot 2024-12-15 at 2 47 00 PM" src="https://github.com/user-attachments/assets/c7cb2275-38c3-4a56-9237-26fa0fd9423c" />
<img width="1535" alt="Screenshot 2024-12-15 at 2 46 36 PM" src="https://github.com/user-attachments/assets/5e7a86b7-caa4-42f5-9129-f5971a962411" />
<img width="2559" alt="Screenshot 2024-12-15 at 3 09 53 PM" src="https://github.com/user-attachments/assets/5d657cc4-0248-422a-a5a8-f41350c28425" />
