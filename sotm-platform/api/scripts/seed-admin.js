/**
 * Creates (or resets) the first super admin. Run once against a fresh
 * database, or whenever you need to recover access:
 *
 *   MONGODB_URI="mongodb+srv://..." \
 *   ADMIN_EMAIL="you@segunobadje.org" \
 *   ADMIN_PASSWORD="a-strong-password" \
 *   node scripts/seed-admin.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { createId } = require('@paralleldrive/cuid2');

async function main() {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD.');
    process.exit(1);
  }
  if (ADMIN_PASSWORD.length < 10) {
    console.error('Use a password of at least 10 characters.');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  const Admin = mongoose.model(
    'Admin',
    new mongoose.Schema(
      {
        _id: { type: String, default: () => createId() },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: true },
        isSuperAdmin: { type: Boolean, default: false },
      },
      { timestamps: true },
    ),
    'admins',
  );

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const existing = await Admin.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    existing.password = hash;
    existing.isAdmin = true;
    existing.isSuperAdmin = true;
    await existing.save();
    console.log(`Updated existing admin ${ADMIN_EMAIL} (password reset, super admin).`);
  } else {
    await Admin.create({
      email: ADMIN_EMAIL,
      password: hash,
      isAdmin: true,
      isSuperAdmin: true,
    });
    console.log(`Created super admin ${ADMIN_EMAIL}.`);
  }
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
