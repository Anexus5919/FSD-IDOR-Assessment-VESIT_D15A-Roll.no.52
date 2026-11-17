# Broken Access Control (IDOR) Assessment

Full Stack Development assignment: vulnerability assessment of a React and Node.js web application,
focused on Broken Access Control and Insecure Direct Object Reference (IDOR).

**Adarsh Singh, D15A, Roll No. 52**

The complete report is [IDOR_Vulnerability_Assessment_Report.pdf](IDOR_Vulnerability_Assessment_Report.pdf).

## Result

**Vulnerable.** While logged in as User A, requesting `GET /api/profiles/102` with User A's own token
returned User B's private profile with `200 OK`. After an ownership check was added to the backend, the
same request returns `404 Not Found`, and each user can still read their own profile.

| Test case | Token | Before fix | After fix |
|---|---|---|---|
| User A reads own profile (101) | User A | 200 OK | 200 OK |
| User A reads User B's profile (102) | User A | 200 OK, User B's data leaked | 404 Not Found |
| User B reads own profile (102) | User B | 200 OK | 200 OK |

## Repository layout

| Path | Contents |
|---|---|
| `server/` | ProfileHub API: Node.js, Express 5, SQLite (`node:sqlite`), JWT login |
| `client/` | ProfileHub frontend: React 19 with Vite (register, log in, view profile) |
| `evidence/` | Screenshots taken during testing (Chrome DevTools and Postman) |

## The fix

The profile route used only the ID from the URL. It now also requires the profile to belong to the
user identified by the verified JWT (`server/src/routes/profiles.js`):

```diff
       FROM profiles p JOIN users u ON u.id = p.user_id
-       WHERE p.id = ?`
+       WHERE p.id = ? AND p.user_id = ?`
     )
-    .get(req.params.id);
+    .get(req.params.id, req.user.id);
```

The original route is kept in `server/src/routes/profiles.vulnerable.js.txt` for comparison, and the
change is its own commit in the history.

## Running it locally

Node.js 22.13 or newer is needed for the built-in `node:sqlite` module.

```bash
# API on http://localhost:5000
cd server
cp .env.example .env      # then set JWT_SECRET to a long random string
npm install
npm start

# Frontend on http://localhost:5173
cd client
npm install
npm run dev
```

Register two accounts from the frontend, then repeat the steps in the report with Chrome DevTools and
Postman.

## Notes

All accounts and profile details are dummy data created for this test. The `.env` file with the JWT
signing secret, the SQLite database and the two original screenshots that show raw tokens are not
committed. Redacted copies of those two screenshots are in `evidence/` with a `_redacted` suffix.
