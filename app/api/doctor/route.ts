import { NextRequest, NextResponse } from 'next/server';
import DoctorRepository from '@/app/admin/doctor/repository/DoctorRepository';
import type { DoctorInsert } from '@/app/database/schema/DoctorTable';

export async function POST(request: NextRequest) {
  try {
    const doctorInsert: DoctorInsert = await request.json();

    if (!doctorInsert.name || !doctorInsert.hospital_id) {
      return NextResponse.json(
        { error: 'name and hospital_id are required' },
        { status: 400 }
      );
    }

    await DoctorRepository.create(doctorInsert);

    return NextResponse.json(
      { message: 'Doctor created successfully' },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
