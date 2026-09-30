import { Request, Response } from 'express';
import crypto from 'crypto';
import { eq, or } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users, otps } from '../db/schema.js';
import { hashPassword, generateOTP } from '../utils/crypto.js';
import { isValidEmail, isValidPhone, sanitizeString, FieldError } from '../utils/validators.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  const timestamp = new Date().toISOString();
  try {
    const { name, organization_id, password, email, phone } = req.body;
    const errors: FieldError[] = [];

    // 1. Validasi & Sanitasi Field Wajib
    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.push({ field: 'name', message: 'Name is required' });
    }
    if (!organization_id || typeof organization_id !== 'string' || organization_id.trim() === '') {
      errors.push({ field: 'organization_id', message: 'Organization ID is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
    }

    // 2. Validasi Salah Satu dari Email atau Phone Harus Ada
    if (!email && !phone) {
      errors.push({ field: 'email/phone', message: 'At least one of email or phone is required' });
    }

    // 3. Validasi Format Email jika diberikan
    let cleanEmail: string | null = null;
    if (email) {
      if (typeof email !== 'string' || !isValidEmail(email.trim())) {
        errors.push({ field: 'email', message: 'Invalid email address format' });
      } else {
        cleanEmail = email.trim().toLowerCase();
      }
    }

    // 4. Validasi Format Phone jika diberikan
    let cleanPhone: string | null = null;
    if (phone) {
      if (typeof phone !== 'string' || !isValidPhone(phone.trim())) {
        errors.push({ field: 'phone', message: 'Invalid phone number format (e.g. +6281234567890)' });
      } else {
        cleanPhone = phone.trim();
      }
    }

    // Jika terdapat error validasi, kembalikan response 400 Bad Request
    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        code: 'BAD_REQUEST',
        message: 'Validation failed',
        errors,
        timestamp,
      });
      return;
    }

    const cleanName = sanitizeString(name);
    const cleanOrgId = sanitizeString(organization_id);

    // 5. Cek Duplikasi Email / Phone di Database
    const existingChecks = [];
    if (cleanEmail) existingChecks.push(eq(users.email, cleanEmail));
    if (cleanPhone) existingChecks.push(eq(users.phone, cleanPhone));

    if (existingChecks.length > 0) {
      const existingUser = await db
        .select()
        .from(users)
        .where(or(...existingChecks))
        .limit(1);

      if (existingUser.length > 0) {
        const isEmailMatch = cleanEmail && existingUser[0].email === cleanEmail;
        res.status(400).json({
          success: false,
          code: 'DUPLICATE_USER',
          message: isEmailMatch ? 'Email is already registered' : 'Phone is already registered',
          errors: [
            {
              field: isEmailMatch ? 'email' : 'phone',
              message: isEmailMatch ? 'Email is already registered' : 'Phone is already registered',
            },
          ],
          timestamp,
        });
        return;
      }
    }

    // 6. Buat User baru & Hashing Password
    const userId = crypto.randomUUID();
    const passwordHash = hashPassword(password);

    await db.insert(users).values({
      id: userId,
      organizationId: cleanOrgId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash,
      status: 'PENDING_ACTIVATION',
      emailVerified: false,
      twoFactorEnabled: false,
    });

    // 7. Generate Kode OTP (Kadaluarsa dalam 15 menit)
    const otpCode = generateOTP(6);
    const otpId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db.insert(otps).values({
      id: otpId,
      userId,
      code: otpCode,
      type: 'REGISTER',
      expiresAt,
    });

    console.log(`[OTP SENT] User ID: ${userId}, OTP Code: ${otpCode}`);

    // 8. Response Success 201 Created
    res.status(201).json({
      success: true,
      code: 'CREATED',
      message: 'Registration successful. Please verify the OTP sent to activate your account.',
      data: {
        id: userId,
        organization_id: cleanOrgId,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        status: 'PENDING_ACTIVATION',
      },
      timestamp,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to process registration',
      timestamp,
    });
  }
};
