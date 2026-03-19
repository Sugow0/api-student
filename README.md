# API Student

[![CI](https://github.com/Sugow0/api-student/actions/workflows/ci.yml/badge.svg)](https://github.com/Sugow0/api-student/actions/workflows/ci.yml)

API REST de gestion des étudiants construite avec [Elysia](https://elysiajs.com/) et [Bun](https://bun.sh/).

## Démarrage

```bash
bun install
bun run dev        # http://localhost:3000
bun run lint       # vérification du code
bun run test:run   # tests unitaires
bun run coverage   # couverture de code
```

Documentation interactive Swagger : [http://localhost:3000/swagger](http://localhost:3000/swagger)

---

## Endpoints

### GET /students

Retourne la liste paginée des étudiants.

**Query params**

| Param   | Type   | Défaut | Description                                      |
|---------|--------|--------|--------------------------------------------------|
| `page`  | number | `1`    | Numéro de page                                   |
| `limit` | number | `10`   | Nombre d'étudiants par page (max 100)            |
| `sort`  | string | —      | Champ de tri : `id`, `firstName`, `lastName`, `grade`, `field` |
| `order` | string | `asc`  | Ordre : `asc` ou `desc`                          |

**Requête**
```http
GET /students?page=1&limit=5&sort=grade&order=desc
```

**Réponse 200**
```json
{
  "data": [
    { "id": 14, "firstName": "Lina", "lastName": "Garcia", "email": "lina.garcia14@example.com", "grade": 20, "field": "mathématiques" }
  ],
  "total": 40,
  "page": 1,
  "limit": 5,
  "totalPages": 8
}
```

---

### GET /students/:id

**Requête**
```http
GET /students/1
```

**Réponse 200**
```json
{ "id": 1, "firstName": "Lucas", "lastName": "Martin", "email": "lucas.martin1@example.com", "grade": 15, "field": "informatique" }
```

**Réponse 404**
```json
{ "message": "Aucun étudiant trouvé avec l'ID 999" }
```

---

### GET /students/search

Recherche multi-critères, insensible à la casse pour les chaînes.

**Query params** : `firstName`, `lastName`, `email`, `grade`, `field` — tous optionnels, combinables.

**Requête**
```http
GET /students/search?lastName=martin&field=informatique
```

**Réponse 200**
```json
[
  { "id": 1, "firstName": "Lucas", "lastName": "Martin", "email": "lucas.martin1@example.com", "grade": 15, "field": "informatique" }
]
```

**Réponse 400** (aucun paramètre fourni)
```json
{ "message": "Au moins un paramètre de recherche est requis" }
```

---

### GET /students/stats

**Requête**
```http
GET /students/stats
```

**Réponse 200**
```json
{
  "totalStudents": 40,
  "averageGrade": 13.55,
  "studentsByField": {
    "informatique": 10,
    "mathématiques": 10,
    "physique": 10,
    "chimie": 10
  },
  "bestStudent": { "id": 14, "firstName": "Lina", "lastName": "Garcia", "email": "lina.garcia14@example.com", "grade": 20, "field": "mathématiques" }
}
```

---

### POST /students

**Requête**
```http
POST /students
Content-Type: application/json

{
  "firstName": "Alice",
  "lastName": "Dupont",
  "email": "alice.dupont@example.com",
  "grade": 15,
  "field": "informatique"
}
```

**Réponse 201**
```json
{ "id": 41, "firstName": "Alice", "lastName": "Dupont", "email": "alice.dupont@example.com", "grade": 15, "field": "informatique" }
```

| Code | Raison |
|------|--------|
| `400` | Champ manquant, format invalide, grade hors [0-20], field inconnu |
| `409` | Email déjà utilisé |

---

### PUT /students/:id

Même body que POST. Remplace l'intégralité de l'étudiant.

**Requête**
```http
PUT /students/1
Content-Type: application/json

{
  "firstName": "Lucas",
  "lastName": "Martin",
  "email": "lucas.new@example.com",
  "grade": 18,
  "field": "informatique"
}
```

**Réponse 200**
```json
{ "id": 1, "firstName": "Lucas", "lastName": "Martin", "email": "lucas.new@example.com", "grade": 18, "field": "informatique" }
```

| Code | Raison |
|------|--------|
| `400` | Données invalides |
| `404` | ID inexistant |
| `409` | Email pris par un autre étudiant |

---

### DELETE /students/:id

**Requête**
```http
DELETE /students/1
```

**Réponse 200**
```json
{ "message": "L'étudiant avec l'ID 1 a été supprimé" }
```

**Réponse 404**
```json
{ "message": "Aucun étudiant trouvé avec l'ID 999" }
```

---

## Valeurs autorisées

| Champ   | Valeurs |
|---------|---------|
| `field` | `informatique`, `mathématiques`, `physique`, `chimie` |
| `grade` | Nombre entre `0` et `20` |
| `order` | `asc`, `desc` |
| `sort`  | `id`, `firstName`, `lastName`, `grade`, `field` |
