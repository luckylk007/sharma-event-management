-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `avatar` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastLogin` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `shortDescription` TEXT NOT NULL,
    `overview` LONGTEXT NOT NULL,
    `banner` JSON NOT NULL,
    `includedServices` JSON NOT NULL,
    `gallery` JSON NOT NULL,
    `faqs` JSON NOT NULL,
    `packages` JSON NOT NULL,
    `icon` VARCHAR(191) NOT NULL DEFAULT 'FaRing',
    `order` INTEGER NOT NULL DEFAULT 0,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `seo` JSON NOT NULL,
    `relatedServiceIds` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `services_slug_key`(`slug`),
    INDEX `services_isPublished_order_idx`(`isPublished`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blogs` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `featuredImage` JSON NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `tags` JSON NOT NULL,
    `author` JSON NOT NULL,
    `readingTime` INTEGER NOT NULL DEFAULT 5,
    `views` INTEGER NOT NULL DEFAULT 0,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `faqs` JSON NOT NULL,
    `seo` JSON NOT NULL,
    `relatedPostIds` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blogs_slug_key`(`slug`),
    INDEX `blogs_category_isPublished_idx`(`category`, `isPublished`),
    INDEX `blogs_isPublished_publishedAt_idx`(`isPublished`, `publishedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gallery_items` (
    `id` VARCHAR(191) NOT NULL,
    `image` JSON NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `gallery_items_category_order_idx`(`category`, `order`),
    INDEX `gallery_items_isFeatured_idx`(`isFeatured`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `service` VARCHAR(191) NULL,
    `eventDate` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'new',
    `source` VARCHAR(191) NOT NULL DEFAULT 'contact-form',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `contacts_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonials` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 5,
    `avatar` JSON NULL,
    `eventType` VARCHAR(191) NOT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `testimonials_isPublished_order_idx`(`isPublished`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `newsletters` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `subscribedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `newsletters_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `id` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL DEFAULT 'Sharma Event Management',
    `tagline` VARCHAR(191) NOT NULL DEFAULT 'Crafting Unforgettable Moments in Uttarakhand',
    `logo` VARCHAR(191) NOT NULL DEFAULT '/logo.svg',
    `logoDark` VARCHAR(191) NOT NULL DEFAULT '/logo-dark.svg',
    `favicon` VARCHAR(191) NOT NULL DEFAULT '/favicon.ico',
    `email` VARCHAR(191) NOT NULL DEFAULT 'hello@sharmaevents.com',
    `phone` VARCHAR(191) NOT NULL DEFAULT '+91 98765 43210',
    `whatsapp` VARCHAR(191) NOT NULL DEFAULT '+919876543210',
    `address` JSON NOT NULL,
    `businessHours` JSON NOT NULL,
    `socialLinks` JSON NOT NULL,
    `mapEmbedUrl` TEXT NOT NULL,
    `googleAnalyticsId` VARCHAR(191) NULL,
    `googleSearchConsoleId` VARCHAR(191) NULL,
    `smtp` JSON NOT NULL,
    `seoDefaults` JSON NOT NULL,
    `about` JSON NOT NULL,
    `home` JSON NOT NULL,
    `privacyPolicy` LONGTEXT NOT NULL,
    `termsConditions` LONGTEXT NOT NULL,
    `newsletterEnabled` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
