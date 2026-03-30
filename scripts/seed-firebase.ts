import * as admin from 'firebase-admin';

const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();
const db   = admin.firestore();
const now  = admin.firestore.Timestamp.now();

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return admin.firestore.Timestamp.fromDate(d);
}

async function seed() {
  console.log('\n🌱 INICIANDO SEED DE DATOS ZENX...\n');

  // ─── ADMIN ────────────────────────────────────────────────
  console.log('👤 Creando Admin...');
  const adminAuth = await auth.createUser({
    email: 'admin@zenx.app',
    password: 'Admin1234!',
    displayName: 'Admin ZENX',
  });
  await db.collection('users').doc(adminAuth.uid).set({
    uid: adminAuth.uid,
    email: 'admin@zenx.app',
    displayName: 'Admin ZENX',
    role: 'admin',
    createdAt: now,
    updatedAt: now,
  });
  console.log('   ✅ admin@zenx.app / Admin1234!');

  // ─── ENTRENADORES ─────────────────────────────────────────
  console.log('\n💪 Creando Entrenadores...');

  const trainer1 = await auth.createUser({
    email: 'carlos@zenx.app',
    password: 'Trainer1234!',
    displayName: 'Carlos Mendoza',
  });
  const trainer2 = await auth.createUser({
    email: 'sofia@zenx.app',
    password: 'Trainer1234!',
    displayName: 'Sofía Reyes',
  });

  await db.collection('users').doc(trainer1.uid).set({
    uid: trainer1.uid,
    email: 'carlos@zenx.app',
    displayName: 'Carlos Mendoza',
    role: 'trainer',
    studentIds: [],
    profile: { experience: '8 años', phone: '+57 300 111 2233' },
    createdAt: now,
    updatedAt: now,
  });
  await db.collection('users').doc(trainer2.uid).set({
    uid: trainer2.uid,
    email: 'sofia@zenx.app',
    displayName: 'Sofía Reyes',
    role: 'trainer',
    studentIds: [],
    profile: { experience: '5 años', phone: '+57 310 444 5566' },
    createdAt: now,
    updatedAt: now,
  });

  console.log('   ✅ carlos@zenx.app / Trainer1234!');
  console.log('   ✅ sofia@zenx.app  / Trainer1234!');

  // ─── ALUMNOS ──────────────────────────────────────────────
  console.log('\n🏋️  Creando Alumnos...');

  const studentsData = [
    { email: 'pablo@zenx.app',   name: 'Pablo Villamizar', trainer: trainer1.uid },
    { email: 'maria@zenx.app',   name: 'María González',   trainer: trainer1.uid },
    { email: 'lucas@zenx.app',   name: 'Lucas Fernández',  trainer: trainer1.uid },
    { email: 'camila@zenx.app',  name: 'Camila Torres',    trainer: trainer2.uid },
    { email: 'rodrigo@zenx.app', name: 'Rodrigo Soto',     trainer: trainer2.uid },
  ];

  const uids: Record<string, string> = {};

  for (const s of studentsData) {
    const u = await auth.createUser({ email: s.email, password: 'Student1234!', displayName: s.name });
    await db.collection('users').doc(u.uid).set({
      uid: u.uid,
      email: s.email,
      displayName: s.name,
      role: 'student',
      trainerId: s.trainer,
      activeRoutineId: null,
      createdAt: now,
      updatedAt: now,
    });
    uids[s.email] = u.uid;
    console.log(`   ✅ ${s.email} / Student1234!`);
  }

  // Vincular studentIds a trainers
  await db.collection('users').doc(trainer1.uid).update({
    studentIds: [uids['pablo@zenx.app'], uids['maria@zenx.app'], uids['lucas@zenx.app']],
  });
  await db.collection('users').doc(trainer2.uid).update({
    studentIds: [uids['camila@zenx.app'], uids['rodrigo@zenx.app']],
  });

  // ─── RUTINAS ──────────────────────────────────────────────
  console.log('\n📋 Creando Rutinas...');

  const rutinaPablo = await db.collection('routines').add({
    trainerId: trainer1.uid,
    studentId: uids['pablo@zenx.app'],
    title: 'Fuerza Upper Body — Semana 1',
    description: 'Rutina enfocada en pecho, espalda y bíceps. Peso moderado, técnica perfecta.',
    isActive: true,
    exercises: [
      { id: 'e1', name: 'Press de banca',  bodyArea: 'pecho',   sets: 4, reps: 10, weight: 60, notes: 'Bajar controlado',              isBlockedByInjury: false },
      { id: 'e2', name: 'Remo con barra',  bodyArea: 'espalda', sets: 4, reps: 10, weight: 50, notes: 'Espalda recta',                  isBlockedByInjury: false },
      { id: 'e3', name: 'Curl de bíceps',  bodyArea: 'brazos',  sets: 3, reps: 12, weight: 15, notes: '',                               isBlockedByInjury: false },
      { id: 'e4', name: 'Press militar',   bodyArea: 'hombros', sets: 3, reps: 10, weight: 40, notes: 'Core activo',                    isBlockedByInjury: false },
      { id: 'e5', name: 'Dominadas',       bodyArea: 'espalda', sets: 3, reps: 8,  weight: 0,  notes: 'Asistidas si es necesario',      isBlockedByInjury: false },
    ],
    createdAt: daysAgo(14),
    updatedAt: daysAgo(2),
  });
  await db.collection('users').doc(uids['pablo@zenx.app']).update({ activeRoutineId: rutinaPablo.id });

  const rutinaMaria = await db.collection('routines').add({
    trainerId: trainer1.uid,
    studentId: uids['maria@zenx.app'],
    title: 'Rehabilitación + Tren Inferior',
    description: 'Adaptada por tendinitis en hombro derecho. Sin ejercicios de empuje.',
    isActive: true,
    exercises: [
      { id: 'e1', name: 'Sentadilla libre',      bodyArea: 'piernas', sets: 4, reps: 12, weight: 40, notes: '',                                          isBlockedByInjury: false },
      { id: 'e2', name: 'Peso muerto rumano',    bodyArea: 'piernas', sets: 3, reps: 10, weight: 35, notes: 'Bisagra de cadera',                          isBlockedByInjury: false },
      { id: 'e3', name: 'Press de banca',        bodyArea: 'pecho',   sets: 0, reps: 0,  weight: 0,  notes: 'BLOQUEADO por tendinitis hombro',            isBlockedByInjury: true  },
      { id: 'e4', name: 'Zancadas',              bodyArea: 'piernas', sets: 3, reps: 12, weight: 20, notes: 'Alternadas',                                 isBlockedByInjury: false },
      { id: 'e5', name: 'Elevaciones laterales', bodyArea: 'hombros', sets: 0, reps: 0,  weight: 0,  notes: 'BLOQUEADO por tendinitis hombro',            isBlockedByInjury: true  },
    ],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(1),
  });
  await db.collection('users').doc(uids['maria@zenx.app']).update({ activeRoutineId: rutinaMaria.id });

  const rutinaLucas = await db.collection('routines').add({
    trainerId: trainer1.uid,
    studentId: uids['lucas@zenx.app'],
    title: 'Hipertrofia Full Body',
    description: 'Rutina de volumen 4 días a la semana. Foco en conexión mente-músculo.',
    isActive: true,
    exercises: [
      { id: 'e1', name: 'Sentadilla',      bodyArea: 'piernas', sets: 4, reps: 8,  weight: 80,  notes: 'Profundidad completa',             isBlockedByInjury: false },
      { id: 'e2', name: 'Press inclinado', bodyArea: 'pecho',   sets: 4, reps: 10, weight: 55,  notes: '',                                 isBlockedByInjury: false },
      { id: 'e3', name: 'Peso muerto',     bodyArea: 'espalda', sets: 3, reps: 6,  weight: 100, notes: 'Máximo cuidado en la espalda',     isBlockedByInjury: false },
      { id: 'e4', name: 'Pull-ups',        bodyArea: 'espalda', sets: 4, reps: 8,  weight: 0,   notes: '',                                 isBlockedByInjury: false },
      { id: 'e5', name: 'Fondos',          bodyArea: 'pecho',   sets: 3, reps: 12, weight: 0,   notes: '',                                 isBlockedByInjury: false },
    ],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(3),
  });
  await db.collection('users').doc(uids['lucas@zenx.app']).update({ activeRoutineId: rutinaLucas.id });

  // Rutina inactiva de Pablo (histórica)
  await db.collection('routines').add({
    trainerId: trainer1.uid,
    studentId: uids['pablo@zenx.app'],
    title: 'Cardio + Core — Mes 1',
    description: 'Primera rutina introductoria. Ya superada.',
    isActive: false,
    exercises: [
      { id: 'e1', name: 'Caminata en cinta',  bodyArea: 'cardio',  sets: 1, reps: 1, weight: 0, notes: '30 min, 6 km/h', isBlockedByInjury: false },
      { id: 'e2', name: 'Plancha abdominal',  bodyArea: 'abdomen', sets: 3, reps: 1, weight: 0, notes: '45 segundos',     isBlockedByInjury: false },
      { id: 'e3', name: 'Crunch con fitball', bodyArea: 'abdomen', sets: 3, reps: 15, weight: 0, notes: '',               isBlockedByInjury: false },
    ],
    createdAt: daysAgo(60),
    updatedAt: daysAgo(14),
  });

  console.log('   ✅ 4 rutinas creadas (1 inactiva, 1 con ejercicios bloqueados)');

  // ─── LESIONES ─────────────────────────────────────────────
  console.log('\n🩹 Creando Lesiones...');

  const lesionMaria = await db.collection('injuries').add({
    studentId: uids['maria@zenx.app'],
    trainerId: trainer1.uid,
    bodyPart: 'hombro',
    description: 'Tendinitis del manguito rotador. Dolor al levantar el brazo por encima de la cabeza y al rotar externamente.',
    severity: 'moderada',
    status: 'en_recuperacion',
    blockedExercises: ['Press de banca', 'Elevaciones laterales'],
    trainerNotes: 'Aplicar hielo 15 min después de entrenar. Fisio martes y jueves. Revisión en 2 semanas.',
    reportedAt: daysAgo(8),
    updatedAt: daysAgo(1),
    comments: [
      {
        id: 'c1',
        authorId: uids['maria@zenx.app'],
        authorName: 'María González',
        authorRole: 'student',
        text: 'Hoy el dolor bajó bastante con el hielo. Pude hacer las sentadillas sin problema.',
        createdAt: daysAgo(5),
      },
      {
        id: 'c2',
        authorId: trainer1.uid,
        authorName: 'Carlos Mendoza',
        authorRole: 'trainer',
        text: 'Perfecto María. La próxima sesión agreguemos rotaciones de manguito con banda elástica, sin peso.',
        createdAt: daysAgo(4),
      },
    ],
  });

  await db.collection('injuries').add({
    studentId: uids['pablo@zenx.app'],
    trainerId: trainer1.uid,
    bodyPart: 'rodilla',
    description: 'Molestia leve en ligamento lateral interno. Apareció tras sentadillas con mucho peso. Ya sin síntomas.',
    severity: 'leve',
    status: 'resuelta',
    blockedExercises: [],
    trainerNotes: 'Reducimos carga 2 semanas y corregimos la pisada. Resuelta sin problema.',
    reportedAt: daysAgo(20),
    updatedAt: daysAgo(5),
    comments: [
      {
        id: 'c1',
        authorId: uids['pablo@zenx.app'],
        authorName: 'Pablo Villamizar',
        authorRole: 'student',
        text: 'Estoy mucho mejor, sin dolor desde hace 4 días.',
        createdAt: daysAgo(6),
      },
      {
        id: 'c2',
        authorId: trainer1.uid,
        authorName: 'Carlos Mendoza',
        authorRole: 'trainer',
        text: 'Excelente. Marcamos como resuelta. Retomamos carga progresiva desde el lunes.',
        createdAt: daysAgo(5),
      },
    ],
  });

  await db.collection('injuries').add({
    studentId: uids['camila@zenx.app'],
    trainerId: trainer2.uid,
    bodyPart: 'espalda_baja',
    description: 'Contractura muscular en zona lumbar tras peso muerto con mala técnica. Dolor fuerte al doblar el tronco.',
    severity: 'grave',
    status: 'activa',
    blockedExercises: ['Peso muerto', 'Sentadilla', 'Buenos días'],
    trainerNotes: 'Reposo absoluto esta semana. No entrenar. Derivada a médico deportivo.',
    reportedAt: daysAgo(3),
    updatedAt: now,
    comments: [
      {
        id: 'c1',
        authorId: trainer2.uid,
        authorName: 'Sofía Reyes',
        authorRole: 'trainer',
        text: 'Camila, para toda actividad física hasta ver al médico. Nada de cargar peso.',
        createdAt: daysAgo(3),
      },
      {
        id: 'c2',
        authorId: uids['camila@zenx.app'],
        authorName: 'Camila Torres',
        authorRole: 'student',
        text: 'Entendido Sofía. Tengo cita con el médico mañana. El calor me ayuda un poco.',
        createdAt: daysAgo(2),
      },
    ],
  });

  console.log('   ✅ 3 lesiones creadas con comentarios');

  // ─── PROGRESO ─────────────────────────────────────────────
  console.log('\n📈 Creando Datos de Progreso...');

  const progressRows: Array<{ email: string; trainer: string; days: number; weight: number; goals: number; streak: number; note: string }> = [
    // Pablo — 8 semanas bajando de peso
    { email: 'pablo@zenx.app', trainer: trainer1.uid, days: 56, weight: 78.5, goals: 3,  streak: 1, note: 'Primer día, motivado.' },
    { email: 'pablo@zenx.app', trainer: trainer1.uid, days: 49, weight: 78.0, goals: 4,  streak: 2, note: 'Empezando a sentir los cambios.' },
    { email: 'pablo@zenx.app', trainer: trainer1.uid, days: 42, weight: 77.5, goals: 5,  streak: 3, note: 'Buena semana, sin faltar.' },
    { email: 'pablo@zenx.app', trainer: trainer1.uid, days: 35, weight: 77.2, goals: 6,  streak: 4, note: 'Aumenté el peso en press de banca.' },
    { email: 'pablo@zenx.app', trainer: trainer1.uid, days: 28, weight: 76.8, goals: 7,  streak: 5, note: 'Lesión leve en rodilla, cuidando.' },
    { email: 'pablo@zenx.app', trainer: trainer1.uid, days: 21, weight: 76.5, goals: 8,  streak: 6, note: 'Rodilla bien, full entreno.' },
    { email: 'pablo@zenx.app', trainer: trainer1.uid, days: 14, weight: 76.0, goals: 9,  streak: 7, note: 'Mejor semana hasta ahora.' },
    { email: 'pablo@zenx.app', trainer: trainer1.uid, days: 7,  weight: 75.8, goals: 10, streak: 8, note: 'Récord personal en dominadas.' },
    // María — menos entradas por la lesión
    { email: 'maria@zenx.app', trainer: trainer1.uid, days: 30, weight: 62.0, goals: 5, streak: 3, note: 'Buen ritmo.' },
    { email: 'maria@zenx.app', trainer: trainer1.uid, days: 20, weight: 61.5, goals: 6, streak: 4, note: 'Sin dolor en hombro hoy.' },
    { email: 'maria@zenx.app', trainer: trainer1.uid, days: 10, weight: 61.8, goals: 4, streak: 2, note: 'Entrenamiendo adaptado por lesión.' },
    // Lucas — progreso constante
    { email: 'lucas@zenx.app', trainer: trainer1.uid, days: 21, weight: 85.0, goals: 8,  streak: 5, note: 'Peso muerto 100 kg conseguido.' },
    { email: 'lucas@zenx.app', trainer: trainer1.uid, days: 14, weight: 84.5, goals: 9,  streak: 6, note: 'Volumen al máximo.' },
    { email: 'lucas@zenx.app', trainer: trainer1.uid, days: 7,  weight: 84.0, goals: 10, streak: 7, note: 'Pull-ups con lastre por primera vez.' },
    // Camila — pocas entradas antes de la lesión
    { email: 'camila@zenx.app', trainer: trainer2.uid, days: 15, weight: 57.0, goals: 5, streak: 3, note: 'Primer registro.' },
    { email: 'camila@zenx.app', trainer: trainer2.uid, days: 8,  weight: 56.5, goals: 6, streak: 4, note: 'Todo bien.' },
    // Rodrigo — solo 1 entrada, sin actividad
    { email: 'rodrigo@zenx.app', trainer: trainer2.uid, days: 5, weight: 70.0, goals: 2, streak: 1, note: 'Primer entrenamiento.' },
  ];

  for (const p of progressRows) {
    await db.collection('progress').add({
      studentId: uids[p.email],
      date: daysAgo(p.days),
      weight: p.weight,
      notes: p.note,
      metrics: { goalsAchieved: p.goals, attendanceStreak: p.streak },
      createdAt: daysAgo(p.days),
    });
  }

  console.log(`   ✅ ${progressRows.length} entradas de progreso creadas`);

  // ─── RESUMEN ──────────────────────────────────────────────
  console.log('\n════════════════════════════════════════════');
  console.log('✅  SEED COMPLETADO — CREDENCIALES ZENX');
  console.log('════════════════════════════════════════════');
  console.log('\n👤 ADMIN');
  console.log('   admin@zenx.app  /  Admin1234!');
  console.log('\n💪 ENTRENADORES  (contraseña: Trainer1234!)');
  console.log('   carlos@zenx.app  →  3 alumnos');
  console.log('   sofia@zenx.app   →  2 alumnos');
  console.log('\n🏋️  ALUMNOS  (contraseña: Student1234!)');
  console.log('   pablo@zenx.app   → Carlos · 8 sem progreso · lesión resuelta');
  console.log('   maria@zenx.app   → Carlos · lesión ACTIVA en hombro · rutina adaptada');
  console.log('   lucas@zenx.app   → Carlos · progreso constante · full body');
  console.log('   camila@zenx.app  → Sofía  · lesión GRAVE lumbar · reposo');
  console.log('   rodrigo@zenx.app → Sofía  · sin datos aún');
  console.log('\n📊 Resumen:');
  console.log(`   ${Object.keys(uids).length + 3} usuarios · 4 rutinas · 3 lesiones · ${progressRows.length} registros de progreso`);
  console.log('════════════════════════════════════════════\n');
}

seed().catch(console.error);
