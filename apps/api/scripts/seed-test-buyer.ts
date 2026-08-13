import { hashPassword } from '../src/services/password.service';
import { prisma } from '../src/lib/db';

async function main() {
  const email = 'wiztest@voeq.test';
  const password = 'Testbuyer123';
  const hash = await hashPassword(password);
  const upserted = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hash,
      hasPassword: true,
      emailVerified: new Date(),
      status: 'active',
      role: 'buyer',
      currentContext: 'buyer',
      agreementVersion: '1.0',
      agreementAcceptedAt: new Date(),
      defaultCampusId: null,
    },
    create: {
      email,
      name: 'Test Buyer',
      passwordHash: hash,
      hasPassword: true,
      emailVerified: new Date(),
      status: 'active',
      role: 'buyer',
      currentContext: 'buyer',
      agreementVersion: '1.0',
      agreementAcceptedAt: new Date(),
    },
  });
  console.log('OK test buyer ready:', upserted.email, upserted.id);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
