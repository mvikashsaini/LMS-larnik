require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const SubCategory = require('../src/models/SubCategory');
const University = require('../src/models/University');

const seedData = async () => {
  try {
    console.log('🌱 Seeding database...\n');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await SubCategory.deleteMany({});
    await University.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create super admin
    const superAdmin = await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@larnik.com',
      phone: '+919876543210',
      password: 'admin123',
      role: 'superAdmin',
      isActive: true,
      emailVerified: true,
      phoneVerified: true
    });
    console.log('✅ Created super admin');

    // Create sample university
    const university = await University.create({
      name: 'Larnik University',
      code: 'LU001',
      email: 'info@larnik.edu',
      phone: '+919876543211',
      address: {
        street: '123 Education Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '400001'
      },
      website: 'https://larnik.edu',
      description: 'A leading educational institution',
      establishedYear: 2020,
      type: 'private',
      isActive: true,
      isApproved: true,
      contactPerson: {
        name: 'Dr. John Doe',
        email: 'john.doe@larnik.edu',
        phone: '+919876543212',
        designation: 'Vice Chancellor'
      }
    });
    console.log('✅ Created sample university');

    // Create university admin
    const universityAdmin = await User.create({
      firstName: 'University',
      lastName: 'Admin',
      email: 'university@larnik.edu',
      phone: '+919876543213',
      password: 'admin123',
      role: 'universityAdmin',
      university: university._id,
      universityRole: 'superAdmin',
      isActive: true,
      emailVerified: true,
      phoneVerified: true
    });
    console.log('✅ Created university admin');

    // Create sample teacher
    const teacher = await User.create({
      firstName: 'John',
      lastName: 'Teacher',
      email: 'teacher@larnik.edu',
      phone: '+919876543214',
      password: 'teacher123',
      role: 'teacher',
      university: university._id,
      teacherProfile: {
        idProof: 'teacher-id-proof.pdf',
        specialization: ['Computer Science', 'Programming'],
        experience: 5,
        qualification: 'M.Tech in Computer Science',
        isApproved: true
      },
      isActive: true,
      emailVerified: true,
      phoneVerified: true
    });
    console.log('✅ Created sample teacher');

    // Create sample student
    const student = await User.create({
      firstName: 'Alice',
      lastName: 'Student',
      email: 'student@example.com',
      phone: '+919876543215',
      role: 'student',
      isActive: true,
      emailVerified: true,
      phoneVerified: true
    });
    console.log('✅ Created sample student');

    // Create sample referral partner
    const referralPartner = await User.create({
      firstName: 'Bob',
      lastName: 'Partner',
      email: 'partner@example.com',
      phone: '+919876543216',
      password: 'partner123',
      role: 'referralPartner',
      isActive: true,
      emailVerified: true,
      phoneVerified: true
    });
    console.log('✅ Created sample referral partner');

    // Create categories
    const categories = await Category.create([
      {
        name: 'Technology',
        description: 'Technology and programming courses',
        color: '#3B82F6',
        order: 1
      },
      {
        name: 'Business',
        description: 'Business and management courses',
        color: '#10B981',
        order: 2
      },
      {
        name: 'Design',
        description: 'Design and creative courses',
        color: '#F59E0B',
        order: 3
      },
      {
        name: 'Marketing',
        description: 'Marketing and advertising courses',
        color: '#EF4444',
        order: 4
      }
    ]);
    console.log('✅ Created categories');

    // Create sub-categories
    const subCategories = [];
    for (const category of categories) {
      if (category.name === 'Technology') {
        subCategories.push(
          await SubCategory.create({
            name: 'Programming',
            category: category._id,
            description: 'Programming and coding courses',
            color: '#1D4ED8',
            order: 1
          }),
          await SubCategory.create({
            name: 'Web Development',
            category: category._id,
            description: 'Web development courses',
            color: '#2563EB',
            order: 2
          }),
          await SubCategory.create({
            name: 'Mobile Development',
            category: category._id,
            description: 'Mobile app development courses',
            color: '#3B82F6',
            order: 3
          })
        );
      } else if (category.name === 'Business') {
        subCategories.push(
          await SubCategory.create({
            name: 'Management',
            category: category._id,
            description: 'Business management courses',
            color: '#059669',
            order: 1
          }),
          await SubCategory.create({
            name: 'Finance',
            category: category._id,
            description: 'Finance and accounting courses',
            color: '#10B981',
            order: 2
          })
        );
      } else if (category.name === 'Design') {
        subCategories.push(
          await SubCategory.create({
            name: 'Graphic Design',
            category: category._id,
            description: 'Graphic design courses',
            color: '#D97706',
            order: 1
          }),
          await SubCategory.create({
            name: 'UI/UX Design',
            category: category._id,
            description: 'UI/UX design courses',
            color: '#F59E0B',
            order: 2
          })
        );
      } else if (category.name === 'Marketing') {
        subCategories.push(
          await SubCategory.create({
            name: 'Digital Marketing',
            category: category._id,
            description: 'Digital marketing courses',
            color: '#DC2626',
            order: 1
          }),
          await SubCategory.create({
            name: 'Social Media Marketing',
            category: category._id,
            description: 'Social media marketing courses',
            color: '#EF4444',
            order: 2
          })
        );
      }
    }
    console.log('✅ Created sub-categories');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Sample users created:');
    console.log('👤 Super Admin: admin@larnik.com / admin123');
    console.log('🏫 University Admin: university@larnik.edu / admin123');
    console.log('👨‍🏫 Teacher: teacher@larnik.edu / teacher123');
    console.log('👨‍🎓 Student: student@example.com (OTP login)');
    console.log('🤝 Referral Partner: partner@example.com / partner123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
