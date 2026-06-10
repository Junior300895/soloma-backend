import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { User, UserRole } from '../../modules/auth/user.entity';
import { Crane, CraneStatus } from '../../modules/cranes/crane.entity';
import { Quote, QuoteStatus, ServiceType } from '../../modules/quotes/quote.entity';
import { Project, ProjectMedia, MediaType } from '../../modules/projects/project.entity';
import { Contact } from '../../modules/contact/contact.entity';
import { Post, PostCategory, PostStatus } from '../../modules/blog/post.entity';
import { Service } from '../../modules/services-page/service.entity';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'soloma_db',
  username: process.env.DB_USER || 'soloma_user',
  password: process.env.DB_PASSWORD || '',
  entities: [User, Crane, Quote, Project, ProjectMedia, Contact, Post, PostCategory, Service],
  synchronize: true,
  charset: 'utf8mb4',
});

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Connexion MySQL établie');

  // Désactiver les contraintes FK le temps du seed
  await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0;');

  // ── 1. UTILISATEURS ─────────────────────────────────────────────────────
  console.log('\n👤 Création des utilisateurs...');
  const userRepo = AppDataSource.getRepository(User);
  await userRepo.clear();
  const users = await userRepo.save([
    {
      email: 'admin@soloma.sn',
      passwordHash: await bcrypt.hash('Admin@2025!', 12),
      name: 'Administrateur SOLOMA',
      role: UserRole.ADMIN,
      isActive: true,
    },
    {
      email: 'editeur@soloma.sn',
      passwordHash: await bcrypt.hash('Editeur@2025!', 12),
      name: 'Éditeur de contenu',
      role: UserRole.EDITOR,
      isActive: true,
    },
  ]);
  console.log(`   ✓ ${users.length} utilisateurs créés`);

  // ── 2. GRUES ─────────────────────────────────────────────────────────────
  console.log('\n🏗️  Création du catalogue de grues...');
  const craneRepo = AppDataSource.getRepository(Crane);
  await craneRepo.clear();
  const cranes = await craneRepo.save([
    {
      model: 'LTM 1050-3.1',
      brand: 'LIEBHERR',
      capacityT: 50,
      maxHeightM: 38,
      maxRadiusM: 44,
      status: CraneStatus.AVAILABLE,
      description: 'Grue mobile tout-terrain de 50 tonnes. Idéale pour les opérations de levage en milieu portuaire et industriel. Équipée d\'un système de stabilisation avancé pour les terrains difficiles.',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    },
    {
      model: 'GR-1000EX-5',
      brand: 'TADANO',
      capacityT: 100,
      maxHeightM: 60,
      maxRadiusM: 52,
      status: CraneStatus.AVAILABLE,
      description: 'Grue automotrice 100 tonnes de dernière génération. Parfaite pour le levage d\'équipements lourds sur chantiers industriels et portuaires.',
      imageUrl: 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=800',
    },
    {
      model: 'GMK 5200-1',
      brand: 'GROVE',
      capacityT: 200,
      maxHeightM: 80,
      maxRadiusM: 68,
      status: CraneStatus.RESERVED,
      description: 'Grue mobile 200 tonnes à flèche télescopique. Conçue pour les opérations de levage complexes nécessitant une grande hauteur de travail.',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    },
    {
      model: 'AC 350-6',
      brand: 'DEMAG',
      capacityT: 350,
      maxHeightM: 120,
      maxRadiusM: 90,
      status: CraneStatus.AVAILABLE,
      description: 'Grue mobile de grande capacité 350 tonnes. Solution premium pour les travaux de génie civil lourds et opérations portuaires d\'envergure.',
      imageUrl: 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=800',
    },
    {
      model: 'LTM 1500-8.1',
      brand: 'LIEBHERR',
      capacityT: 500,
      maxHeightM: 188,
      maxRadiusM: 108,
      status: CraneStatus.MAINTENANCE,
      description: 'Grue mobile 500 tonnes — la plus puissante de notre flotte. Réservée aux projets exceptionnels nécessitant une capacité de levage maximale.',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    },
    {
      model: 'RT 600E',
      brand: 'MANITOWOC',
      capacityT: 60,
      maxHeightM: 42,
      maxRadiusM: 36,
      status: CraneStatus.AVAILABLE,
      description: 'Grue tout terrain compacte 60 tonnes. Idéale pour les espaces contraints et les chantiers à accès difficile.',
      imageUrl: 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=800',
    },
  ]);
  console.log(`   ✓ ${cranes.length} grues créées`);

  // ── 3. SERVICES ──────────────────────────────────────────────────────────
  console.log('\n⚙️  Création des services...');
  const serviceRepo = AppDataSource.getRepository(Service);
  await serviceRepo.clear();
  await serviceRepo.save([
    { slug: 'manutention-portuaire', title: 'Manutention Portuaire', description: 'Chargement, déchargement et transit de marchandises 24h/24.', icon: 'Ship', isActive: true, sortOrder: 1 },
    { slug: 'levage-industriel', title: 'Levage Industriel', description: 'Location de grues mobiles et levage complexe de 50T à 500T.', icon: 'Construction', isActive: true, sortOrder: 2 },
    { slug: 'operations-logistiques', title: 'Opérations Logistiques', description: 'Transport terrestre et coordination multimodale avec suivi GPS.', icon: 'Package', isActive: true, sortOrder: 3 },
    { slug: 'services-associes', title: 'Services Associés', description: 'Conseil technique, inspection qualité et formation des équipes.', icon: 'Wrench', isActive: true, sortOrder: 4 },
  ]);
  console.log(`   ✓ 4 services créés`);

  // ── 4. PROJETS ───────────────────────────────────────────────────────────
  console.log('\n📁 Création des projets...');
  const projectRepo = AppDataSource.getRepository(Project);
  const mediaRepo = AppDataSource.getRepository(ProjectMedia);
  await mediaRepo.clear();
  await projectRepo.clear();
  const projects = await projectRepo.save([
    {
      title: 'Levage d\'une turbine de 180T au Port Autonome de Dakar',
      location: 'Port Autonome de Dakar, Sénégal',
      client: 'Port Autonome de Dakar',
      description: 'Opération de levage exceptionnelle d\'une turbine industrielle de 180 tonnes. Déploiement de la grue LIEBHERR LTM 1500-8.1 avec une équipe de 12 techniciens spécialisés.',
      results: 'Opération réalisée en 8 heures avec zéro incident. Précision de positionnement : 2 mm. Délai respecté.',
      coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200',
      completedAt: '2024-11-15',
    },
    {
      title: 'Déchargement de 15 000 tonnes de riz au terminal céréalier',
      location: 'Terminal Céréalier de Dakar, Sénégal',
      client: 'SONACOS',
      description: 'Déchargement de grande envergure : 15 000 tonnes de riz en provenance d\'Asie. 4 grues portiques et 45 manutentionnaires sur 72 heures non-stop.',
      results: '15 000 tonnes déchargées en 72h, 30% plus rapide que le délai contractuel. Économie de 120 000 EUR de surestaries.',
      coverImage: 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=1200',
      completedAt: '2024-09-03',
    },
    {
      title: 'Montage d\'une charpente métallique — Usine de Thiès',
      location: 'Zone Industrielle de Thiès, Sénégal',
      client: 'SOCOCIM Industries',
      description: 'Levage et assemblage d\'une charpente métallique de 2 400 m². Utilisation de 2 grues TADANO 100T en tandem.',
      results: 'Charpente assemblée en 5 jours, 48 éléments levés sans incident. Client en production 2 semaines en avance.',
      coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200',
      completedAt: '2024-07-20',
    },
    {
      title: 'Transport et installation d\'un transformateur 90 MVA',
      location: 'Centrale Électrique de Tobène, Sénégal',
      client: 'SENELEC',
      description: 'Transport exceptionnel et installation d\'un transformateur 90 MVA / 95 tonnes. Convoi de 280 km depuis le port jusqu\'au site.',
      results: 'Transformateur installé et mis en service en 4 jours. Aucun dommage au matériel ni à l\'infrastructure.',
      coverImage: 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=1200',
      completedAt: '2024-05-12',
    },
    {
      title: 'Opérations de manutention — Terminal à Conteneurs DIT',
      location: 'Terminal à Conteneurs DIT, Dakar',
      client: 'Dakar Container Terminal',
      description: 'Contrat annuel de support : mise à disposition de 2 grues mobiles et équipes spécialisées pour dépannage et levage hors-gabarit.',
      results: '200+ interventions réalisées, taux de disponibilité 99,2%. Amélioration de la productivité du terminal : +12%.',
      coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200',
      completedAt: '2024-12-31',
    },
    {
      title: 'Démantèlement d\'une plateforme industrielle à Mbao',
      location: 'Zone Industrielle de Mbao, Dakar',
      client: 'TotalEnergies Sénégal',
      description: 'Démantèlement d\'une plateforme de stockage de 800 m². Découpe, levage et évacuation de 450 tonnes d\'acier en zone ATEX.',
      results: 'Site entièrement démantelé dans les délais. 450 tonnes d\'acier valorisé. Zéro incident de sécurité.',
      coverImage: 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=1200',
      completedAt: '2023-10-08',
    },
  ]);
  await mediaRepo.save([
    { projectId: projects[0].id, type: MediaType.PHOTO, url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', caption: 'Vue d\'ensemble du levage', sortOrder: 1 },
    { projectId: projects[0].id, type: MediaType.PHOTO, url: 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=800', caption: 'Positionnement de la turbine', sortOrder: 2 },
    { projectId: projects[1].id, type: MediaType.PHOTO, url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', caption: 'Opérations au terminal céréalier', sortOrder: 1 },
    { projectId: projects[2].id, type: MediaType.PHOTO, url: 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=800', caption: 'Levage de la charpente', sortOrder: 1 },
    { projectId: projects[3].id, type: MediaType.PHOTO, url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', caption: 'Transport exceptionnel en route', sortOrder: 1 },
    { projectId: projects[3].id, type: MediaType.VIDEO, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', caption: 'Vidéo de l\'installation du transformateur', sortOrder: 2 },
  ]);
  console.log(`   ✓ ${projects.length} projets créés avec médias`);

  // ── 5. DEVIS ─────────────────────────────────────────────────────────────
  console.log('\n📋 Création des demandes de devis...');
  const quoteRepo = AppDataSource.getRepository(Quote);
  await quoteRepo.clear();
  await quoteRepo.save([
    { craneId: cranes[0].id, fullName: 'Ibrahima Diallo', email: 'i.diallo@portdakar.sn', phone: '+221 77 123 45 67', company: 'Port Autonome de Dakar', serviceType: ServiceType.LEVAGE, message: 'Besoin d\'une grue 50T pour une opération de levage d\'équipements portuaires sur 5 jours en novembre.', status: QuoteStatus.PENDING },
    { craneId: cranes[1].id, fullName: 'Fatou Mbaye', email: 'f.mbaye@sococim.sn', phone: '+221 70 987 65 43', company: 'SOCOCIM Industries', serviceType: ServiceType.LEVAGE, message: 'Grue 100T pour montage d\'une nouvelle ligne de production à Rufisque. Durée estimée : 2 semaines.', status: QuoteStatus.PROCESSED },
    { fullName: 'Moussa Sarr', email: 'm.sarr@totalenergies.sn', phone: '+221 76 555 44 33', company: 'TotalEnergies Sénégal', serviceType: ServiceType.MANUTENTION, message: 'Solution complète de manutention et évacuation de matériels lourds. Surface : 500 m². Calendrier : mars 2025.', status: QuoteStatus.PENDING },
    { craneId: cranes[3].id, fullName: 'Cheikh Ndiaye', email: 'c.ndiaye@senelec.sn', phone: '+221 78 222 33 44', company: 'SENELEC', serviceType: ServiceType.LEVAGE, message: 'Installation d\'un groupe électrogène 85 tonnes à la centrale de Bel-Air. Visite technique préalable souhaitée.', status: QuoteStatus.PROCESSED },
    { fullName: 'Aissatou Camara', email: 'a.camara@sonacos.sn', phone: '+221 77 666 77 88', company: 'SONACOS', serviceType: ServiceType.LOGISTIQUE, message: 'Transport et stockage temporaire de 500 tonnes d\'arachides entre Diourbel et le port de Dakar. 2 rotations/semaine.', status: QuoteStatus.ARCHIVED },
    { craneId: cranes[2].id, fullName: 'Omar Faye', email: 'o.faye@ditdakar.sn', phone: '+221 76 100 20 30', company: 'Dakar Container Terminal', serviceType: ServiceType.LEVAGE, message: 'Déplacement d\'un portique à conteneurs en panne. Urgence opérationnelle — intervention souhaitée sous 48h.', status: QuoteStatus.PENDING },
  ]);
  console.log(`   ✓ 6 devis créés`);

  // ── 6. MESSAGES ──────────────────────────────────────────────────────────
  console.log('\n✉️  Création des messages de contact...');
  const contactRepo = AppDataSource.getRepository(Contact);
  await contactRepo.clear();
  await contactRepo.save([
    { fullName: 'Aminata Touré', email: 'a.toure@entreprise.sn', phone: '+221 77 444 55 66', subject: 'Demande de partenariat commercial', message: 'Bonjour, je représente une entreprise de BTP à Dakar. Nous cherchons un partenaire pour la location de grues sur nos chantiers. Pouvons-nous organiser une réunion ?', isRead: false },
    { fullName: 'Babacar Ndiaye', email: 'b.ndiaye@mining-sn.com', phone: '+221 70 333 44 55', subject: 'Renseignements levage en milieu minier', message: 'Nous opérons une mine d\'or à Kédougou et cherchons des services de levage industriel pour l\'installation de nouveaux équipements d\'extraction.', isRead: true },
    { fullName: 'Marie-Claire Dupont', email: 'mc.dupont@bnp-dakar.com', subject: 'Certification ISO et documents techniques', message: 'Dans le cadre d\'un audit fournisseurs, nous avons besoin de vos certificats ISO, attestations d\'assurance et fiches techniques.', isRead: false },
    { fullName: 'Lamine Konaté', email: 'l.konate@construction-afrique.com', phone: '+221 76 789 01 23', subject: 'Projet immobilier — Tour R+15 au Plateau', message: 'Nous construisons un immeuble de grande hauteur. Besoin d\'une grue à tour pour 8 mois. Début des travaux : avril 2025.', isRead: false },
    { fullName: 'Seydou Traoré', email: 's.traore@logistique-ouest.sn', phone: '+221 78 456 78 90', subject: 'Offre groupée transport + levage', message: 'Nous gérons 10 à 15 importations de machines industrielles par an. Cherchons un prestataire unique pour le levage à quai et le transport jusqu\'à Thiaroye.', isRead: true },
  ]);
  console.log(`   ✓ 5 messages créés`);

  // ── 7. BLOG ──────────────────────────────────────────────────────────────
  console.log('\n📰 Création des articles de blog...');
  const catRepo = AppDataSource.getRepository(PostCategory);
  const postRepo = AppDataSource.getRepository(Post);
  await postRepo.clear();
  await catRepo.clear();
  const cats = await catRepo.save([
    { name: 'Manutention', slug: 'manutention' },
    { name: 'Levage Industriel', slug: 'levage-industriel' },
    { name: 'Logistique', slug: 'logistique' },
    { name: 'Sécurité', slug: 'securite' },
    { name: 'Actualités', slug: 'actualites' },
  ]);
  await postRepo.save([
    {
      categoryId: cats[0].id,
      slug: 'levage-record-180t-port-dakar',
      title: 'SOLOMA réalise un levage record de 180T au Port Autonome de Dakar',
      excerpt: 'Une opération exceptionnelle menée avec succès grâce à notre expertise et nos équipements de pointe.',
      content: '<h2>Une opération d\'exception</h2><p>Le 15 novembre 2024, les équipes de SOLOMA SUARL ont réalisé avec succès une opération de levage exceptionnelle au Port Autonome de Dakar : l\'installation d\'une turbine industrielle de 180 tonnes.</p><h2>Une préparation minutieuse</h2><p>Cette opération a nécessité trois semaines de préparation. Nos ingénieurs ont élaboré un plan de levage détaillé prenant en compte les contraintes de charge, de vent et d\'espace disponible.</p><h2>Une exécution parfaite</h2><p>L\'opération a duré 8 heures avec une précision de positionnement de 2 mm. Aucun incident à déplorer.</p>',
      status: PostStatus.PUBLISHED,
      coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200',
      publishedAt: new Date('2024-11-20'),
    },
    {
      categoryId: cats[1].id,
      slug: 'nouvelle-flotte-grues-soloma-2025',
      title: 'SOLOMA renforce sa flotte avec deux nouvelles grues 200T',
      excerpt: 'L\'acquisition de deux GROVE GMK 5200 renforce considérablement notre capacité de levage industriel.',
      content: '<h2>Un investissement stratégique</h2><p>Dans le cadre de notre plan de développement 2025-2027, SOLOMA SUARL a investi dans l\'acquisition de deux nouvelles grues mobiles GROVE GMK 5200 d\'une capacité de 200 tonnes chacune.</p><h2>Disponibilité immédiate</h2><p>Ces deux nouvelles grues sont désormais disponibles à la location. Contactez-nous pour un devis personnalisé.</p>',
      status: PostStatus.PUBLISHED,
      coverImage: 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=1200',
      publishedAt: new Date('2025-01-05'),
    },
    {
      categoryId: cats[3].id,
      slug: 'bonnes-pratiques-securite-manutention-portuaire',
      title: '10 règles de sécurité incontournables en manutention portuaire',
      excerpt: 'Les protocoles que nous appliquons pour garantir la sécurité de nos opérateurs et de vos marchandises.',
      content: '<h2>La sécurité, notre priorité absolue</h2><p>Chez SOLOMA SUARL, la sécurité est le fondement de toutes nos opérations. Voici les 10 règles d\'or que nous appliquons sur chacun de nos chantiers.</p><h2>1. Formation continue obligatoire</h2><p>Tous nos opérateurs suivent une formation de sécurité tous les 6 mois couvrant les risques spécifiques à la manutention portuaire.</p><h2>2. Vérification systématique des équipements</h2><p>Avant chaque opération, un technicien qualifié inspecte tous les équipements. Tout matériel défectueux est immédiatement retiré du service.</p>',
      status: PostStatus.PUBLISHED,
      coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200',
      publishedAt: new Date('2025-01-10'),
    },
    {
      categoryId: cats[2].id,
      slug: 'optimiser-chaine-logistique-portuaire-afrique-ouest',
      title: 'Comment optimiser sa chaîne logistique portuaire en Afrique de l\'Ouest',
      excerpt: 'Analyse des défis logistiques spécifiques à la région et solutions concrètes pour améliorer votre supply chain.',
      content: '<h2>Les défis logistiques en Afrique de l\'Ouest</h2><p>L\'Afrique de l\'Ouest représente un marché en pleine expansion avec des flux commerciaux ayant augmenté de 23% en 5 ans. Les entreprises font face à des défis spécifiques : infrastructures en développement, procédures douanières complexes.</p>',
      status: PostStatus.PUBLISHED,
      coverImage: 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=1200',
      publishedAt: new Date('2024-12-15'),
    },
    {
      categoryId: cats[4].id,
      slug: 'soloma-certifiee-iso-9001-2024',
      title: 'SOLOMA SUARL obtient la certification ISO 9001:2015',
      excerpt: 'Nous sommes fiers d\'annoncer l\'obtention de notre certification ISO 9001:2015.',
      content: '<h2>Un engagement reconnu</h2><p>Après 18 mois d\'un processus rigoureux, SOLOMA SUARL a obtenu la certification ISO 9001:2015, récompensant notre système de management de la qualité.</p>',
      status: PostStatus.PUBLISHED,
      coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200',
      publishedAt: new Date('2024-10-01'),
    },
    {
      categoryId: cats[1].id,
      slug: 'guide-choisir-grue-mobile-projet',
      title: 'Comment choisir la bonne grue mobile pour votre projet ?',
      excerpt: 'Guide pratique pour sélectionner la grue adaptée à votre chantier selon la charge, la hauteur et les contraintes du site.',
      content: '<h2>Les critères de sélection essentiels</h2><p>Le choix d\'une grue mobile engage la sécurité de votre chantier et l\'efficacité de vos opérations. Voici les paramètres clés à analyser avant de faire votre choix.</p>',
      status: PostStatus.DRAFT,
      publishedAt: null,
    },
  ]);
  console.log(`   ✓ 6 articles créés`);

  // ── RÉSUMÉ ───────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(50));
  console.log('🎉 SEED TERMINÉ AVEC SUCCÈS !');
  console.log('═'.repeat(50));
  console.log('\n🔑 Identifiants de connexion :');
  console.log('   Admin    → admin@soloma.sn     / Admin@2025!');
  console.log('   Éditeur  → editeur@soloma.sn   / Editeur@2025!');
  console.log('\n🌐 Admin  : http://localhost:3000/admin/login');
  console.log('📚 Swagger: http://localhost:3001/docs\n');

  // Réactiver les contraintes FK
  await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Erreur lors du seed :', err.message);
  process.exit(1);
});