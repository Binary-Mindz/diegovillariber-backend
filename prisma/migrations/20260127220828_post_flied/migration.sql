-- CreateEnum
CREATE TYPE "VisiualStyle" AS ENUM ('Action', 'Aerial', 'Artistic', 'Drift', 'Black_And_White', 'Cinematic', 'Close_Up', 'Motion_Blur', 'Day', 'Detail_Shot', 'Golden_Hour', 'Long_Exposure', 'Macro', 'Night_Shot', 'Panoramic', 'Panning', 'Raw', 'Rollin_Shot', 'Wet_Conditions', 'Wide_Angle', 'Abandoned', 'AI_Generated');

-- CreateEnum
CREATE TYPE "ContextActivity" AS ENUM ('Car_Meet', 'Celebration', 'Drag_Race', 'Diving', 'Garage', 'Highway', 'Iconic_Location', 'Offroad', 'Onboard', 'Mountain_Road', 'Natural_Landscape', 'Perked', 'Rally', 'Road', 'Static', 'Studio', 'Trackday', 'Urban');

-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('Brake_Details', 'Cockpit', 'Driver_Portrait', 'Engine_Bay', 'Exterior', 'Front_Detail', 'Interior', 'Logos', 'Rear_Detail', 'Side', 'Wheel');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "contextActivity" "ContextActivity"[] DEFAULT ARRAY[]::"ContextActivity"[],
ADD COLUMN     "subject" "Subject"[] DEFAULT ARRAY[]::"Subject"[],
ADD COLUMN     "visiualStyle" "VisiualStyle"[] DEFAULT ARRAY[]::"VisiualStyle"[];
