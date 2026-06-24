# Deployment Guide

This guide explains how to deploy the **YourRepo** application to production using **Render** (for the backend API) and **Vercel** (for the React frontend).

---

## Prerequisites

1. A [GitHub](https://github.com) account.
2. A [Render](https://render.com) account.
3. A [Vercel](https://vercel.com) account.
4. Your project pushed to a GitHub repository (follow the steps in [PUSH_TO_GITHUB.md](PUSH_TO_GITHUB.md)).

---

## Step 1: Deploy Backend to Render

Render is excellent for hosting Node.js applications.

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service settings:
   - **Name**: `yourrepo-backend` (or any unique name)
   - **Region**: Choose the region closest to your users.
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Scroll down and click **Advanced** to add **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render binds automatically, but it's good practice)
   - `GITHUB_TOKEN`: *[Your GitHub personal access token]* (Optional, but highly recommended to avoid API rate limits)
   - `FRONTEND_URL`: *[Leave blank or use temporary value; we will update this with your Vercel URL in Step 3]*
6. Click **Create Web Service**.
7. Note down the backend URL provided by Render (e.g., `https://yourrepo-backend.onrender.com`).

---

## Step 2: Deploy Frontend to Vercel

Vercel is the recommended hosting platform for Vite/React frontends.

1. Log in to [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** and select **Project**.
3. Import your GitHub repository.
4. Configure the Project settings:
   - **Framework Preset**: `Vite` (Vercel should auto-detect this)
   - **Root Directory**: Click *Edit* and select the `frontend` folder.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand the **Environment Variables** section and add:
   - **Key**: `VITE_API_URL`
   - **Value**: *[The URL of your Render backend from Step 1]* (e.g., `https://yourrepo-backend.onrender.com`)
6. Click **Deploy**.
7. Once the deployment finishes, copy your Vercel deployment URL (e.g., `https://yourrepo.vercel.app`).

---

## Step 3: Link Vercel Frontend to Render Backend (CORS)

For security, the backend only allows requests from the domain specified in `FRONTEND_URL`.

1. Return to your [Render Dashboard](https://dashboard.render.com/).
2. Select your `yourrepo-backend` web service.
3. Go to **Environment** settings.
4. Edit the `FRONTEND_URL` variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://<your-vercel-domain>.vercel.app` (Use the actual URL of your deployed Vercel frontend)
5. Save changes. Render will automatically start a new deployment with the updated configuration.

---

## Summary of Environment Variables

### Backend (Render)
| Variable | Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Enables production mode optimizations |
| `GITHUB_TOKEN` | `ghp_...` | GitHub Personal Access Token |
| `FRONTEND_URL` | `https://yourrepo.vercel.app` | URL of your frontend for CORS validation |

### Frontend (Vercel)
| Variable | Value | Description |
|---|---|---|
| `VITE_API_URL` | `https://yourrepo-backend.onrender.com` | URL of your backend API |
