import { NextRequest, NextResponse } from 'next/server';
import DoctorRepository from '@/app/admin/doctor/repository/DoctorRepository';
import type { DoctorUpdate } from '@/app/database/schema/DoctorTable';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const doctorUpdate: DoctorUpdate = await request.json();

    await DoctorRepository.update(id, doctorUpdate);

    return NextResponse.json(
      { message: 'Doctor updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await DoctorRepository.delete(id);

    return NextResponse.json(
      { message: 'Doctor deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
