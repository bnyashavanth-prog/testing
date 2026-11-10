import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // The test accounts get the password from SEED_PASSWORD so no known
  // default password ever ends up in a real database.
  const seedPassword = process.env.SEED_PASSWORD
  if (!seedPassword || seedPassword.length < 8) {
    throw new Error('Set SEED_PASSWORD (at least 8 characters) in .env before running the seed.')
  }
  const hashedPassword = await bcrypt.hash(seedPassword, 10)

  // 1. Specialties
  const specialties = [
    'Accident and emergency medicine', 'Allergology', 'Anaesthetics', 'Biological hematology',
    'Cardiology', 'Child psychiatry', 'Clinical biology', 'Clinical chemistry',
    'Clinical neurophysiology', 'Clinical radiology', 'Dental, oral and maxillo-facial surgery',
    'Dermato-venerology', 'Dermatology', 'Endocrinology', 'Gastro-enterologic surgery',
    'Gastroenterology', 'General hematology', 'General Practice', 'General surgery',
    'Geriatrics', 'Immunology', 'Infectious diseases', 'Internal medicine',
    'Laboratory medicine', 'Maxillo-facial surgery', 'Microbiology', 'Nephrology',
    'Neuro-psychiatry', 'Neurology', 'Neurosurgery', 'Nuclear medicine',
    'Obstetrics and gynecology', 'Occupational medicine', 'Ophthalmology', 'Orthopaedics',
    'Otorhinolaryngology', 'Paediatric surgery', 'Paediatrics', 'Pathology',
    'Pharmacology', 'Physical medicine and rehabilitation', 'Plastic surgery', 'Podiatric Medicine',
    'Podiatric Surgery', 'Psychiatry', 'Public health and Preventive Medicine', 'Radiology',
    'Radiotherapy', 'Respiratory medicine', 'Rheumatology', 'Stomatology',
    'Thoracic surgery', 'Tropical medicine', 'Urology', 'Vascular surgery', 'Venereology'
  ]

  for (let i = 0; i < specialties.length; i++) {
    await prisma.specialty.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        id: i + 1,
        sname: specialties[i],
      },
    })
  }

  // 2. Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@edoc.com' },
    update: {},
    create: {
      email: 'admin@edoc.com',
      password: hashedPassword,
      role: 'admin',
      admin: {
        create: {}
      }
    },
  })

  // 3. Doctor User
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@edoc.com' },
    update: {},
    create: {
      email: 'doctor@edoc.com',
      password: hashedPassword,
      role: 'doctor',
      doctor: {
        create: {
          docname: 'Test Doctor',
          docnic: '000000000',
          doctel: '0110000000',
          specialtyId: 1
        }
      }
    },
  })

  // 4. Patient User
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@edoc.com' },
    update: {},
    create: {
      email: 'patient@edoc.com',
      password: hashedPassword,
      role: 'patient',
      patient: {
        create: {
          pname: 'Test Patient',
          paddress: 'Sri Lanka',
          pnic: '0000000000',
          pdob: new Date('2000-01-01'),
          ptel: '0120000000'
        }
      }
    },
  })

  console.log({ adminUser, doctorUser, patientUser })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
