# Deployment Guide (Railway / Fly.io)

Since you want to keep **SQLite** and **Local File Storage**, you must deploy to a platform that supports **Persistent Storage** (Volumes).

## Option 1: Railway (Recommended for Ease of Use)
Railway is very easy to set up and "just works" with the Dockerfile providing.

1.  **Push your code to GitHub**.
2.  **Sign up at [railway.app](https://railway.app)**.
3.  **New Project** -> **Deploy from GitHub repo**.
4.  Railway will detect the `Dockerfile` and start building.
5.  **Configure Persistence (Important!)**:
    - Go to your service settings.
    - Click **Volumes**.
    - Add a volume mounted at `/app/prisma` (for the database).
    - Add a volume mounted at `/app/uploads` (for the files).
6.  **Public URL**:
    - Go to **Settings** -> **Networking** -> **Generate Domain**.

## Option 2: Fly.io (Good for Performance)
Fly.io runs VMs close to your users.

1.  Install the Fly CLI: `powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"`
2.  Login: `fly auth login`
3.  Launch: `fly launch`
    - It will detect the `Dockerfile`.
    - Select a region.
    - **Do not** deploy yet if asked (say No), or deploy and then update config.
4.  **Add Volumes** (Crucial for data persistence):
    - `fly vol create data_db -s 1gb -r <region>`
    - `fly vol create data_uploads -s 1gb -r <region>`
    - Update `fly.toml` to mount these volumes to `/app/prisma` and `/app/uploads`.
5.  Deploy: `fly deploy`

## Why not Vercel?
Vercel is serverless. It destroys your "server" after every request/deployment, so your SQLite DB and uploaded files would get deleted instantly. The above platforms keep them alive.

## Option 3: Render (Works, but Paid for Persistence)
Render supports Docker, but the **Free Tier** does NOT support Persistent Disks.
- If you deploy on Render Free Tier, **you will lose your data** (Database & Files) every time the app restarts (which happens often on free tier).
- To make it work (keep data safe), you must upgrade to a **Paid Web Service** ($7/mo start) and add a **Disk**.

1.  **New +** -> **Web Service**.
2.  Connect GitHub repo.
3.  Runtime: **Docker**.
4.  **Important**: Under "Advanced" or "Disks", add a Disk.
    - Mount Path: `/app/data` (You might need to adjust your app to store DB and uploads in one folder, or pay for two disks).
    - *Note*: Render disks are paid.

