# Todo App

## Wymagania

- Node.js (https://nodejs.org/)
- npm (dołączone z Node.js)

## Uruchomienie projektu

### 1. Backend (API)

1. Przejdź do katalogu `backend`:

    ```bash
    cd todo-backend
    ```

2. Zainstaluj zależności:

    ```bash
    npm install
    ```

3. Uruchom serwer:

    ```bash
    npm start
    ```

Serwer backendowy będzie dostępny pod adresem: `http://127.0.0.1:3000`

### 2. Frontend (Aplikacja React)

1. Przejdź do katalogu `frontend`:

    ```bash
    cd todo-frontend
    ```

2. Zainstaluj zależności:

    ```bash
    npm install
    ```

3. Uruchom aplikację:

    ```bash
    npm start
    ```

Aplikacja frontendowa będzie dostępna pod adresem: `http://localhost:3001`

### 3. Zależności

- Backend wykorzystuje `express`, `cors` oraz `body-parser`.
- Frontend wykorzystuje `react`, `axios`, i `typescript`.

## Użycie

Aplikacja pozwala na zarządzanie listą zadań (CRUD: Tworzenie, Edytowanie, Usuwanie, Zmiana statusu) i jest połączona z API w backendzie.
