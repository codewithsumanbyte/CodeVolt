# CodeVolt - Secure File & Text Sharing Platform

## 📋 Overview

CodeVolt is a modern, secure file and text sharing platform that allows users to store and access their data using unique access codes. Built with cutting-edge web technologies, CodeVolt provides a seamless experience for sharing sensitive information with optional password protection and automatic expiration.

## 🎯 Features

### Core Functionality
- **File Storage**: Upload multiple files with size validation (10MB limit)
- **Text Storage**: Store text data alongside files
- **Unique Access Codes**: Generate 8-character alphanumeric codes for data access
- **Password Protection**: Optional password protection for sensitive data
- **Auto-Expiration**: Automatic data deletion after 24 hours
- **PDF Viewer**: Built-in PDF viewing capability
- **File Management**: Download and delete files after access

### Security Features
- **File Type Validation**: Supports common file types (PDF, images, documents, etc.)
- **Size Limitation**: 10MB maximum file size per upload
- **Access Control**: Password-protected data access
- **Automatic Cleanup**: Expired data is automatically inaccessible
- **Secure Storage**: Files stored with unique, non-sequential filenames

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface built with shadcn/ui components
- **Real-time Feedback**: Toast notifications for all user actions
- **Copy to Clipboard**: One-click code copying
- **Modal PDF Viewer**: In-app PDF viewing without leaving the platform

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)
- **Form Handling**: Native FormData API

### Backend
- **API**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **File Storage**: Local filesystem with unique filename generation
- **Authentication**: Password-based access control
- **Validation**: Comprehensive input and file validation

### Development Tools
- **Package Manager**: Bun
- **Linting**: ESLint with Next.js rules
- **Code Quality**: TypeScript strict mode
- **Hot Reload**: Next.js development server

## 📁 Project Structure

```
codevault/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/
│   │   │   │   └── route.ts          # File upload endpoint
│   │   │   ├── data/
│   │   │   │   └── [code]/
│   │   │   │       └── route.ts      # Data retrieval endpoint
│   │   │   └── files/
│   │   │       └── [filename]/
│   │   │           └── route.ts      # File download/delete endpoint
│   │   ├── layout.tsx               # Root layout with metadata
│   │   ├── page.tsx                 # Main application component
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   └── ui/                      # shadcn/ui components
│   ├── hooks/
│   │   ├── use-mobile.ts            # Mobile detection hook
│   │   └── use-toast.ts             # Toast notification hook
│   └── lib/
│       ├── db.ts                    # Prisma database client
│       └── utils.ts                 # Utility functions
├── prisma/
│   └── schema.prisma                # Database schema
├── uploads/                         # File storage directory
├── public/
│   └── logo.svg                     # Default logo
├── package.json                     # Dependencies and scripts
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── next.config.ts                   # Next.js configuration
```

## 🗄️ Data Storage Architecture

### Database Schema

The application uses Prisma ORM with SQLite, featuring two main models:

#### Share Model
```prisma
model Share {
  id          String   @id @default(cuid())
  code        String   @unique
  textData    String?
  password    String?
  expiresAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  files       File[]
}
```

**Fields:**
- `id`: Unique identifier (CUID)
- `code`: 8-character unique access code
- `textData`: Optional text content
- `password`: Optional password for access control
- `expiresAt`: Automatic expiration timestamp (24 hours from creation)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `files`: One-to-many relationship with File model

#### File Model
```prisma
model File {
  id        String   @id @default(cuid())
  fileName  String
  filePath  String
  fileSize  Int
  mimeType  String
  shareId   String
  createdAt DateTime @default(now())
  share     Share    @relation(fields: [shareId], references: [id], onDelete: Cascade)
}
```

**Fields:**
- `id`: Unique identifier (CUID)
- `fileName`: Original filename
- `filePath`: Unique storage filename
- `fileSize`: File size in bytes
- `mimeType`: MIME type for content handling
- `shareId`: Foreign key to Share model
- `createdAt`: Creation timestamp
- `share`: Many-to-one relationship with Share model

### File Storage System

#### Storage Strategy
- **Location**: Local filesystem (`/uploads/` directory)
- **Naming**: Unique filenames generated using nanoid (16 characters + extension)
- **Security**: Files stored with non-sequential names to prevent enumeration
- **Cleanup**: Files deleted when corresponding database record is removed

#### File Validation
- **Size Limit**: Maximum 10MB per file
- **Allowed Types**:
  - Text files: `text/plain`, `text/*`
  - Documents: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - Images: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
  - Archives: `application/zip`, `application/x-zip-compressed`

#### Access Control
- **Database-Level**: Files linked to share records with expiration
- **Filesystem-Level**: Files inaccessible without database reference
- **Application-Level**: Password protection and code validation

## 🔄 API Endpoints

### 1. Upload Endpoint
**Path**: `POST /api/upload`

**Functionality**:
- Accepts files and text data via FormData
- Generates unique 8-character access code
- Validates file size and type
- Stores files with unique names
- Creates database records
- Returns access code to user

**Request Body**:
```typescript
FormData {
  files: File[]          // Multiple files
  textData?: string      // Optional text content
  password?: string      // Optional password
}
```

**Response**:
```json
{
  "code": "ABX92K",
  "message": "Data uploaded successfully",
  "filesCount": 2,
  "hasTextData": true
}
```

### 2. Data Retrieval Endpoints

#### GET /api/data/[code]
**Functionality**:
- Retrieves data without password protection
- Validates access code format
- Checks expiration status
- Returns file URLs and text data

#### POST /api/data/[code]
**Functionality**:
- Retrieves password-protected data
- Validates password
- Returns file URLs and text data

**Request Body**:
```json
{
  "password": "user123"
}
```

**Response**:
```json
{
  "id": "share_id",
  "code": "ABX92K",
  "textData": "Sample text content",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "expiresAt": "2025-01-08T00:00:00.000Z",
  "files": [
    {
      "id": "file_id",
      "fileName": "document.pdf",
      "filePath": "unique_filename.pdf",
      "fileSize": 1024000,
      "mimeType": "application/pdf",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "url": "/api/files/unique_filename.pdf"
    }
  ]
}
```

### 3. File Management Endpoints

#### GET /api/files/[filename]
**Functionality**:
- Serves files for download
- Validates access through share expiration
- Sets proper content headers
- Handles file streaming

#### DELETE /api/files/[filename]
**Functionality**:
- Deletes files from filesystem
- Removes database records
- Validates file existence
- Returns success confirmation

## 🎨 User Interface

### Design System
- **Color Palette**: Slate-based with blue accents
- **Typography**: Geist font family
- **Components**: shadcn/ui for consistency
- **Spacing**: Tailwind CSS spacing system
- **Responsive**: Mobile-first design approach

### Key Components

#### Header Section
- Logo display
- Application title ("CodeVolt")
- Tagline and attribution
- Centered layout with proper spacing

#### Tabbed Interface
- **Store Data Tab**: File upload and text input
- **Access Data Tab**: Code entry and data retrieval

#### File Upload Interface
- Multiple file selection
- File type and size validation
- Text input area
- Password protection option
- Upload progress feedback

#### Data Access Interface
- Access code input with formatting
- Password input for protected data
- File list with actions (View, Download, Delete)
- PDF viewer modal
- Text content display

#### Interactive Elements
- **Copy Button**: One-click code copying
- **PDF Viewer**: In-app PDF viewing
- **Download Button**: File download capability
- **Delete Button**: File deletion with confirmation
- **Toast Notifications**: Real-time feedback

## 🔒 Security Measures

### Input Validation
- **Access Code Format**: 8-character alphanumeric validation
- **Password Validation**: Optional but required for protected data
- **File Type Validation**: MIME type checking
- **File Size Limits**: 10MB maximum per file

### Access Control
- **Unique Codes**: Non-sequential, hard-to-guess access codes
- **Password Protection**: Optional encryption for sensitive data
- **Expiration**: Automatic data invalidation after 7 days
- **Session-less**: No persistent sessions, code-based access

### Data Protection
- **File Naming**: Unique filenames prevent enumeration
- **Database Security**: Foreign key constraints and cascading deletes
- **Filesystem Security**: Restricted access to upload directory
- **HTTPS Ready**: Compatible with secure connections

## 🚀 Deployment

### Development Setup
```bash
# Install dependencies
bun install

# Set up database
bun run db:push

# Start development server
bun run dev
```

### Production Considerations
- **Database**: SQLite suitable for small to medium deployments
- **File Storage**: Local filesystem for simplicity
- **Scalability**: Consider cloud storage for large deployments
- **Security**: Enable HTTPS in production
- **Monitoring**: Add logging and error tracking

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
```

## 📈 Performance Optimizations

### Frontend
- **Hydration Prevention**: Client-side rendering with proper mounting
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js image handling
- **Bundle Analysis**: Built-in webpack analysis

### Backend
- **Database Indexing**: Prisma automatic indexing
- **File Streaming**: Efficient file serving
- **Memory Management**: Proper cleanup of file handles
- **Caching**: Browser-level caching for static assets

## 🔧 Future Enhancements

### Planned Features
- **User Accounts**: Persistent user profiles
- **Cloud Storage**: AWS S3 or Google Cloud integration
- **Advanced Analytics**: Usage statistics and insights
- **API Rate Limiting**: Prevent abuse
- **Email Notifications**: Expiration warnings
- **Dark Mode**: Enhanced theme support
- **Mobile App**: React Native companion app

### Technical Improvements
- **Database Migration**: PostgreSQL for larger deployments
- **CDN Integration**: Global content delivery
- **Advanced Search**: Full-text search capabilities
- **WebSockets**: Real-time updates
- **Microservices**: Service-oriented architecture

## 📄 License

This project is created and maintained by Suman. All rights reserved.

## 🤝 Contributing

Contributions are welcome! Please ensure all code follows the established patterns and includes appropriate tests.

## 📞 Support

For support or feature requests, please contact the development team.