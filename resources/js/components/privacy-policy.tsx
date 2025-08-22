/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 21/08/2025 - 16:12:28
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 21/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
// import { env } from 'process';
import { usePage } from '@inertiajs/react';
import React from 'react';

// Asumsi Anda memiliki komponen Card, CardHeader, CardContent, dll dari ShadCN
// Jika tidak, ganti dengan div atau section biasa
// Import jika Anda menggunakan komponen custom
// import { Card, CardHeader, CardContent } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';

interface PolicySectionProps {
    title: string;
    children: React.ReactNode;
    id: string;
}

const PolicySection: React.FC<PolicySectionProps> = ({ title, children, id }) => (
    <section id={id} className="mb-8">
        <h2 className="mb-4 border-b pb-2 text-2xl font-bold text-primary">{title}</h2>
        <div className="space-y-4 text-gray-700">{children}</div>
    </section>
);

const PrivacyPolicy: React.FC = () => {
    const { props } = usePage<{ name: string }>();

    const effectiveDate = '[Tanggal, Bulan, Tahun]';
    const websiteName = props.name || '[Nama Website Anda]';
    const websiteUrl = '[URL Website Anda]';
    const contactEmail = 'leancofferoastery.service@gmail.com';

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-10 text-center">
                <h1 className="mb-2 text-4xl font-extrabold text-gray-900">Kebijakan Privasi</h1>
                <p className="text-sm text-gray-500">
                    Untuk {websiteName} ({websiteUrl})
                </p>
                <p className="mt-1 text-sm text-gray-500">Tanggal Efektif: {effectiveDate}</p>
            </header>

            {/* Konten Utama Kebijakan Privasi */}
            <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
                <p className="mb-6">
                    Terima kasih telah mengunjungi {websiteName}. Privasi Anda sangat penting bagi kami. Kebijakan Privasi ini menjelaskan bagaimana
                    kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi pribadi Anda saat Anda menggunakan layanan kami.
                </p>
                <p className="mb-6 font-semibold">
                    Dengan mendaftar atau menggunakan layanan kami, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini.
                </p>

                {/* SECTION 1: INFORMASI YANG KAMI KUMPULKAN */}
                <PolicySection title="1. Informasi yang Kami Kumpulkan" id="data-collected">
                    <p>
                        Kami mengumpulkan beberapa jenis informasi untuk berbagai tujuan guna menyediakan dan meningkatkan layanan kami kepada Anda.
                    </p>

                    <h3 className="mt-4 text-lg font-semibold">A. Informasi yang Anda Berikan Secara Langsung</h3>
                    <ul className="ml-6 list-disc space-y-2">
                        <li>
                            <strong>Data Akun:</strong> Nama Lengkap, Alamat Email, Nomor Telepon, Kata Sandi (terenkripsi).
                        </li>
                        <li>
                            <strong>Data Profil (Opsional):</strong> Foto Profil, Jenis Kelamin, Tanggal Lahir.
                        </li>
                        <li>
                            <strong>Data Alamat Pengiriman:</strong> Nama Penerima, Nomor Telepon Penerima, dan detail alamat lengkap.
                        </li>
                        <li>
                            <strong>Data Komunikasi:</strong> Catatan korespondensi jika Anda menghubungi layanan pelanggan.
                        </li>
                    </ul>

                    <h3 className="mt-4 text-lg font-semibold">B. Informasi yang Dikumpulkan Secara Otomatis</h3>
                    <ul className="ml-6 list-disc space-y-2">
                        <li>
                            <strong>Data Log dan Penggunaan:</strong> IP Address, jenis browser, waktu kunjungan, dan halaman yang diakses.
                        </li>
                        <li>
                            <strong>Cookies dan Teknologi Pelacakan Serupa:</strong> Kami menggunakan cookies untuk melacak aktivitas di layanan kami.
                        </li>
                    </ul>

                    <h3 className="mt-4 text-lg font-semibold">C. Informasi dari Pihak Ketiga (OAuth)</h3>
                    <p>Jika Anda masuk melalui layanan pihak ketiga (misalnya Google), kami menerima informasi profil dasar sesuai otorisasi Anda.</p>
                </PolicySection>

                {/* SECTION 2: BAGAIMANA KAMI MENGGUNAKAN INFORMASI ANDA */}
                <PolicySection title="2. Bagaimana Kami Menggunakan Informasi Anda" id="data-use">
                    <ul className="ml-6 list-disc space-y-2">
                        <li>**Penyediaan Layanan:** Untuk mengelola akun dan memproses pesanan.</li>
                        <li>**Komunikasi:** Untuk mengirimkan notifikasi pesanan dan menanggapi pertanyaan Anda.</li>
                        <li>**Peningkatan Layanan:** Untuk analisis data dan pengembangan fitur baru.</li>
                        <li>**Keamanan:** Untuk memverifikasi identitas, mencegah penipuan, dan mematuhi hukum.</li>
                    </ul>
                </PolicySection>

                {/* SECTION 3: DENGAN SIAPA KAMI MEMBAGIKAN INFORMASI ANDA (PENAMBAHAN META) */}
                <PolicySection title="3. Dengan Siapa Kami Membagikan Informasi Anda" id="data-sharing">
                    <p>Kami tidak menjual informasi pribadi Anda. Informasi dibagikan dalam situasi berikut:</p>
                    <ul className="ml-6 list-disc space-y-2">
                        <li>**Mitra Logistik/Kurir:** Dibagikan untuk tujuan pengiriman pesanan Anda (nama, alamat, telepon penerima).</li>
                        <li>**Penyedia Gerbang Pembayaran:** Untuk memproses transaksi pembayaran yang aman.</li>
                        <li>
                            **Mitra Iklan dan Pemasaran (Meta Platforms, Inc.):**
                            <p className="mt-1 ml-4 text-sm">
                                Kami menggunakan layanan pihak ketiga, termasuk Meta Platforms, Inc. (Facebook, Instagram), melalui teknologi seperti
                                **Meta Pixel** atau **Conversions API**. Alat ini memungkinkan Meta mengumpulkan informasi tentang tindakan Anda di
                                situs kami (misalnya, melihat produk atau pembelian). Data ini digunakan untuk memberikan iklan yang relevan kepada
                                Anda di platform Meta dan untuk tujuan pengukuran dan analisis.
                            </p>
                        </li>
                        <li>**Penyedia Layanan Lainnya:** Penyedia hosting, layanan email, dan layanan analisis yang bekerja atas nama kami.</li>
                        <li>**Kewajiban Hukum:** Jika diwajibkan oleh undang-undang atau permintaan yang sah dari otoritas publik.</li>
                    </ul>
                </PolicySection>

                {/* SECTION 4 & Seterusnya: Standar */}
                <PolicySection title="4. Keamanan Data" id="security">
                    <p>
                        Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang wajar (termasuk enkripsi dan hashing) untuk melindungi
                        informasi pribadi Anda. Meskipun demikian, perlu diingat bahwa tidak ada metode transmisi melalui internet yang 100% aman.
                    </p>
                </PolicySection>

                <PolicySection title="5. Hak Anda Sebagai Pengguna" id="user-rights">
                    <ul className="ml-6 list-disc space-y-2">
                        <li>**Hak Akses:** Meminta salinan informasi yang kami miliki.</li>
                        <li>**Hak Koreksi:** Memperbaiki data yang tidak akurat (dapat dilakukan melalui pengaturan akun).</li>
                        <li>**Hak Penghapusan:** Meminta penghapusan data, tunduk pada kewajiban hukum untuk retensi data transaksi.</li>
                        <li>**Hak Membatalkan Persetujuan:** Menghentikan komunikasi pemasaran.</li>
                    </ul>
                </PolicySection>

                <PolicySection title="6. Kontak Kami" id="contact">
                    <p>Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi kami:</p>
                    <ul className="ml-6 list-disc">
                        <li>
                            Email:{' '}
                            <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline">
                                {contactEmail}
                            </a>
                        </li>
                        <li>Halaman Kontak: [Link ke Halaman Kontak di Website Anda]</li>
                    </ul>
                </PolicySection>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
