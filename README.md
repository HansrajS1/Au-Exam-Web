# AU Exam Web App
<h3>A full-stack web application for uploading and managing academic papers, built for Alliance University Students. Users can submit academic papers, preview uploads, and manage content by subject, topic, and branch.</h3>

## 🌐 Live : [AU Exam Web](https://auexamapp.tech/)  
Backend Link : [Spring Boot](https://github.com/HansrajS1/Au-Exam-App-backend)

App Link : [AU Exam App](https://github.com/HansrajS1/Au-Exam-App)

---

##  Installation

```bash
git clone https://github.com/HansrajS1/Au-Exam-Web
cd Au-Exam-Web
npm install
```

---

##  Development

Run the dev server:  
```bash
npm run dev
```

App will be available at:  
`http://localhost:5173`

---

##  Building for Production

```bash
npm run build
npm run preview
```

---

##  Environment Variables

Create a `.env` file in project root:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.example.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_BASE_URL=your_backend_api
```

---

## Troubleshooting

- **Appwrite auth not working**  
  → Make sure `.env` variables are correctly prefixed with `VITE_`  

- **API requests blocked (CORS issue)**  
  → Enable CORS in Spring Boot backend config  

- **Netlify build error**  
  → Add this in Netlify build settings:  
  ```
  Build Command: npm run build
  Publish Directory: dist
  ```

---

## Author

**HANS RAJ**  
Bengaluru, India  

---

## License

MIT — feel free to fork, extend, and deploy.  
