// src/core/config/file.config.ts

import { registerAs } from '@nestjs/config';

export default registerAs('file', () => ({
  /**
   * Storage mode: 'local' | 'external' | 'cloud'
   */
  storageMode: process.env.FILE_STORAGE_MODE || 'local',

  /**
   * Local storage configuration (used in dev)
   */
  local: {
    uploadDir: process.env.FILE_LOCAL_UPLOAD_DIR || 'assets/uploads',
    generatedDir: process.env.FILE_LOCAL_GENERATED_DIR || 'assets/generated',
  },

  /**
   * External storage configuration (used in UAT/testing)
   */
  external: {
    basePath: process.env.FILE_EXTERNAL_BASE_PATH || '/mnt/uat-files',
  },

  /**
   * Cloud configuration (used in production)
   */
  cloud: {
    provider: process.env.FILE_CLOUD_PROVIDER || 'aws', // 'aws' | 'digitalocean'
    bucket: process.env.FILE_CLOUD_BUCKET,
    region: process.env.FILE_CLOUD_REGION,
    accessKey: process.env.FILE_CLOUD_ACCESS_KEY,
    secretKey: process.env.FILE_CLOUD_SECRET_KEY,
    endpoint: process.env.FILE_CLOUD_ENDPOINT, // required for DigitalOcean Spaces
  },

  /**
   * Should files be stored date-wise like uploads/2025-04-21/
   */
  useDateFolder: process.env.FILE_USE_DATE_FOLDER === 'true',

  /**
   * Should files be stored based on resource like uploads/users/, uploads/products/
   */
  useResourceFolder: process.env.FILE_USE_RESOURCE_FOLDER === 'true',

   /**
   * Static file storage path
   * Used to store system templates, logos, banners, etc.
   */
   staticDir: process.env.FILE_STATIC_DIR || 'assets/static',

  /**
   * Auto-cleanup settings for generated files based on template file creation date 
   */
  generatedCleanup: {
    enabled: process.env.FILE_GENERATED_CLEANUP_ENABLED !== 'false',
    intervalHours: parseInt(process.env.FILE_GENERATED_CLEANUP_INTERVAL_HOURS || '24', 10),
  },
}));

/*
✅ file.config.ts – Design Overview
We'll support 3 storage modes:

Local (dev) → Project root: assets/uploads/, assets/generated/, assets/static/

UAT/Testing → Custom directory (e.g. external drive or mount) for file Upload

Production → Cloud: AWS S3 / DigitalOcean Spaces for file Upload

We'll also support:

Date-based and resource-based subfolders (toggle) along with Date.

Configurable cleanup for generated files based on file creation Date.

Optional path prefixing or tenant support in future.

🧱 Suggested Directory Structure (for local)
project-root/
└── assets/
    ├── uploads/               # User uploads (images, docs, etc.)
    │   └── [resource]/[date]/uploaded-file.jpg
    └── generated/             # System-generated files (PDFs, exports, etc.)
        └── temp-[hash].pdf
    └── queue/             # System-generated files (PDFs, exports, etc.)
        └── queue-[hash].[extension]  # If using queue, choose file for persistance queue.
    └── static/             # System-generated files (PDFs, exports, etc.)
        └── logo.png
        └── templates/       # System templates (email, SMS, etc.)
            └── sample-template.doc/ 




*/