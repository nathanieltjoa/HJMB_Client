import './App.scss';

import React, {useState} from 'react';
import {Container} from 'react-bootstrap';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import ApolloProvider from './ApolloProvider';  

import Login from './pages/Login';
import Register from './pages/Daftar Karyawan';
import MasterKaryawan from './pages/Karyawan/MasterKaryawan';
import DetailKaryawan from './pages/Karyawan/Detail Karyawan';
import Permintaan from './pages/Permintaan';
import DetailPermintaan from './pages/Detail Permintaan';
import PermintaanPinjaman from './pages/Permintaan/Permintaan Utang';
import DetailPinjaman from './pages/Permintaan/Detail Utang';
import PermintaanSurat from './pages/Permintaan/Permintaan Surat';
import DetailSurat from './pages/Permintaan/Detail Surat';
import TambahSuratPeringatan from './pages/Penambahan/Tambah Surat Peringatan';
import DaftarSuratPeringatan from './pages/Penambahan/Daftar Surat Peringatan';
import DaftarSuratPerintah from './pages/Penambahan/Daftar Surat Perintah';
import DetailSuratPerintah from './pages/Penambahan/Detail Surat Perintah';
import Dashboard from './pages/Dashboard';
import Profil from './pages/Profil';
import UbahPassword from './pages/Ubah Password';
import TambahSuratPerintah from './pages/Penambahan/Tambah Surat Perintah Kerja';
import RegisterGudang from './pages/Tambah Gudang';
import RegisterMesin from './pages/Tambah Mesin';
import TambahGroup from './pages/Tambah Group';
import DetailPembagianGroup from './pages/Pembagian Group Detail';
import Menu from './pages/Menu';
import Overview from './pages/Overview';
import RegisterAbsensi from './pages/Absensi/Tambah Absensi';
import DaftarAbsensi from './pages/Absensi/Daftar Absensi';
import RegisterJamKerja from './pages/Tambah Jam Kerja';
import RegisterKuisioner from './pages/Kuisioner/Tambah Kuisioner';
import RegisterPertanyaan from './pages/Kuisioner/Tambah Pertanyaan';
import DaftarTanggapan from './pages/Kuisioner/DaftarTanggapan';
import MasterKuisioner from './pages/Kuisioner/Master Kuisioner';
import DetailKuisioner from './pages/Kuisioner/Detail Kuisioner';
import DetailPertanyaan from './pages/Kuisioner/Detail Pertanyaan';
import TambahPertanyaanBaru from './pages/Kuisioner/Tambah Pertanyaan Baru';
import DetailDistribusi from './pages/Kuisioner/Detail Distribusi';
import IsiKuisioner from './pages/Kuisioner/Isi Kuisioner';
import TambahPenilaian from './pages/Penilaian/Tambah Penilaian';
import DaftarPenilaian from './pages/Penilaian/Daftar Penilaian';
import MasterNilai from './pages/Penilaian/Master Nilai';
import MasterIndex from './pages/Penilaian/Master Index';
import MasterIzin from './pages/Izin/Master Izin';
import TambahIzin from './pages/Izin/Tambah Izin';
import DaftarIzinPribadi from './pages/Izin/Daftar Izin Pribadi';
import DetailIzinPribadi from './pages/Izin/Detail Izin Pribadi';
import MasterGaji from './pages/Kontrak/MasterGaji';
import MasterIuran from './pages/Kontrak/MasterIuran';
import MasterKontrak from './pages/Kontrak/Master Kontrak';
import TambahKontrak from './pages/Kontrak/Tambah Kontrak';
import DetailKontrak from './pages/Kontrak/Detail Kontrak';
import MasterPembayaranGaji from './pages/Kontrak/Master Pembayaran Gaji';
import DetailPembayaranGaji from './pages/Kontrak/Detail Pembayaran Gaji';
import GenerateSlipGaji from './pages/Kontrak/Generate Slip Gaji';
import ProduksiPipa from './pages/Laporan/Produksi Pipa';
import MixerPipa from './pages/Laporan/Mixer Pipa';
import QualityControl from './pages/Laporan/Quality Control';
import StokistPipa from './pages/Laporan/Stokist Pipa';
import Armada from './pages/Laporan/Armada';
import CatTegel from './pages/Laporan/Cat Tegel';
import Hollow from './pages/Laporan/Hollow';
import Spandek from './pages/Laporan/Spandek';
import Sekuriti from './pages/Laporan/Sekuriti';
import Sales from './pages/Laporan/Sales';
import DetailSales from './pages/Laporan/Sales Detail';
import DetailSekuriti from './pages/Laporan/Sekuriti Detail';
import DetailArmada from './pages/Laporan/Armada Detail';
import DetailStokistPipa from './pages/Laporan/Stokist Pipa Detail';
import DetailQualityControlPipa from './pages/Laporan/Quality Control Detail';
import DetailProduksiPipa from './pages/Laporan/Produksi Pipa Detail';
import DetailCatTegel from './pages/Laporan/Cat Tegel Detail';
import DetailMixerPipa from './pages/Laporan/Mixer Pipa Detail';

//direktur
import MasterKaryawanDirektur from './pages/Direktur/Karyawan/MasterKaryawan';
import RegisterKaryawanDirektur from './pages/Direktur/Karyawan/Daftar HRD';
import DetailKaryawanDirektur from './pages/Direktur/Karyawan/Detail Karyawan';
import MasterGajiDirektur from './pages/Direktur/Kontrak/MasterGaji';
import MasterIuranDirektur from './pages/Direktur/Kontrak/MasterIuran';
import MasterKontrakDirektur from './pages/Direktur/Kontrak/Master Kontrak';
import DetailKontrakDirektur from './pages/Direktur/Kontrak/Detail Kontrak';
import MasterPembayaranGajiDirektur from './pages/Direktur/Kontrak/Master Pembayaran Gaji';
import DetailPembayaranGajiDirektur from './pages/Direktur/Kontrak/Detail Pembayaran Gaji';
import PermintaanPinjamanDirektur from './pages/Direktur/Permintaan/Permintaan Utang';
import DetailPinjamanDirektur from './pages/Direktur/Permintaan/Detail Utang';
import PermintaanDirektur from './pages/Direktur/Permintaan/Permintaan';
import DetailPermintaanDirektur from './pages/Direktur/Permintaan/Detail Permintaan';
import DaftarAbsensiDirektur from './pages/Direktur/Absensi/Daftar Absensi';
import MasterKuisionerDirektur from './pages/Direktur/Kuisioner/Master Kuisioner';
import DaftarTanggapanDirektur from './pages/Direktur/Kuisioner/DaftarTanggapan';
import DetailKuisionerDirektur from './pages/Direktur/Kuisioner/Detail Kuisioner';
import DetailDistribusiDirektur from './pages/Direktur/Kuisioner/Detail Distribusi';
import MasterNilaiDirektur from './pages/Direktur/Penilaian/Master Nilai';
import MasterIndexDirektur from './pages/Direktur/Penilaian/Master Index';
import DaftarPenilaianDirektur from './pages/Direktur/Penilaian/Daftar Penilaian';
import MasterIzinDirektur from './pages/Direktur/Izin/Master Izin';
import DaftarPermintaanPromosi from './pages/Direktur/Promosi/Daftar Permintaan';
import DaftarSuratPerintahDirektur from './pages/Direktur/Surat/Daftar Surat Perintah';
import DetailSuratPerintahDirektur from './pages/Direktur/Surat/Detail Surat Perintah';
import PermintaanSuratDirektur from './pages/Direktur/Surat/Permintaan Surat';
import DetailSuratDirektur from './pages/Direktur/Surat/Detail Surat';

import { Reports, ReportsOne, ReportsTwo, ReportsThree } from './pages/Reports';
import Team from './pages/Team';

import {AuthProvider} from './context/auth';
import DynamicRoute from './util/DynamicRoute';
import Sidebar from './components/SideBar';
function App() {
  const [isLogin, setLogin] = useState('false');

  return (
    <ApolloProvider>
      <AuthProvider>
        <BrowserRouter>
          <Container className="pt-5">
            <Sidebar />
            <Switch>
              <DynamicRoute path='/' exact component={Login} guest />
              <DynamicRoute path='/dashboard' exact component={Dashboard} authenticated />
              <DynamicRoute path='/reports' exact component={Reports} authenticated />
              <DynamicRoute path='/reports/reports1' exact component={ReportsOne} authenticated />
              <DynamicRoute path='/reports/reports2' exact component={ReportsTwo} authenticated />
              <DynamicRoute path='/reports/reports3' exact component={ReportsThree} authenticated />
              <DynamicRoute path='/karyawan/register' exact component={Register} authenticated />
              <DynamicRoute path='/karyawan/master karyawan' exact component={MasterKaryawan} authenticated />
              <DynamicRoute path='/karyawan/detail karyawan' exact component={DetailKaryawan} authenticated />
              <DynamicRoute path='/penambahan/tambah gudang' exact component={RegisterGudang} authenticated />
              <DynamicRoute path='/penambahan/mesin' exact component={RegisterMesin} authenticated />
              <DynamicRoute path='/penambahan/tambah group' exact component={TambahGroup} authenticated />
              <DynamicRoute path='/surat/tambah surat' exact component={TambahSuratPerintah} authenticated />
              <DynamicRoute path='/surat/tambah surat peringatan' exact component={TambahSuratPeringatan} authenticated />
              <DynamicRoute path='/surat/daftar surat peringatan' exact component={DaftarSuratPeringatan} authenticated />
              <DynamicRoute path='/surat/daftar surat keterangan' exact component={PermintaanSurat} authenticated />
              <DynamicRoute path='/surat/detail surat' exact component={DetailSurat} authenticated />
              <DynamicRoute path='/surat/daftar surat perintah' exact component={DaftarSuratPerintah} authenticated />
              <DynamicRoute path='/surat/detail surat perintah' exact component={DetailSuratPerintah} authenticated />
              <DynamicRoute path='/surat/daftar surat perintah' exact component={DaftarSuratPerintah} authenticated />
              <DynamicRoute path='/penambahan/detail pembagian group' exact component={DetailPembagianGroup} authenticated />
              <DynamicRoute path='/absensi/tambah' exact component={RegisterAbsensi} authenticated />
              <DynamicRoute path='/absensi/daftar' exact component={DaftarAbsensi} authenticated />
              <DynamicRoute path='/jamKerja/tambah' exact component={RegisterJamKerja} authenticated />
              <DynamicRoute path='/kuisioner/tambah kuisioner' exact component={RegisterKuisioner} authenticated />
              <DynamicRoute path='/kuisioner/tambah pertanyaan' exact component={RegisterPertanyaan} authenticated />
              <DynamicRoute path='/kuisioner/daftar tanggapan' exact component={DaftarTanggapan} authenticated />
              <DynamicRoute path='/kuisioner/master kuisioner' exact component={MasterKuisioner} authenticated />
              <DynamicRoute path='/kuisioner/detail kuisionerku' exact component={DetailKuisioner} authenticated />
              <DynamicRoute path='/kuisioner/detail pertanyaan' exact component={DetailPertanyaan} authenticated />
              <DynamicRoute path='/kuisioner/tambah pertanyaan baru' exact component={TambahPertanyaanBaru} authenticated />
              <DynamicRoute path='/kuisioner/detail distribusi' exact component={DetailDistribusi} authenticated />
              <DynamicRoute path='/kuisioner/isi kuisioner' exact component={IsiKuisioner} authenticated />
              <DynamicRoute path='/penilaian/tambah penilaian' exact component={TambahPenilaian} authenticated />
              <DynamicRoute path='/penilaian/master index' exact component={MasterIndex} authenticated />
              <DynamicRoute path='/penilaian/daftar penilaian' exact component={DaftarPenilaian} authenticated />
              <DynamicRoute path='/penilaian/master nilai' exact component={MasterNilai} authenticated />
              <DynamicRoute path='/izin/master izin' exact component={MasterIzin} authenticated />
              <DynamicRoute path='/izin/tambah izin' exact component={TambahIzin} authenticated />
              <DynamicRoute path='/izin/daftar izin pribadi' exact component={DaftarIzinPribadi} authenticated />
              <DynamicRoute path='/izin/detail izin pribadi' exact component={DetailIzinPribadi} authenticated />
              <DynamicRoute path='/kontrak/master gaji' exact component={MasterGaji} authenticated />
              <DynamicRoute path='/kontrak/master iuran' exact component={MasterIuran} authenticated />
              <DynamicRoute path='/kontrak/master kontrak' exact component={MasterKontrak} authenticated />
              <DynamicRoute path='/kontrak/tambah kontrak' exact component={TambahKontrak} authenticated />
              <DynamicRoute path='/kontrak/detail kontrak' exact component={DetailKontrak} authenticated />
              <DynamicRoute path='/kontrak/master pembayaran gaji' exact component={MasterPembayaranGaji} authenticated />
              <DynamicRoute path='/kontrak/detail pembayaran gaji' exact component={DetailPembayaranGaji} authenticated />
              <DynamicRoute path='/kontrak/generate slip gaji' exact component={GenerateSlipGaji} authenticated />
              <DynamicRoute path='/permintaan/permintaan izin' exact component={Permintaan} authenticated />
              <DynamicRoute path='/permintaan/detail permintaan' exact component={DetailPermintaan} authenticated />
              <DynamicRoute path='/permintaan/permintaan pinjaman' exact component={PermintaanPinjaman} authenticated />
              <DynamicRoute path='/permintaan/detail pinjaman' exact component={DetailPinjaman} authenticated />
              <DynamicRoute path='/laporan/produksi pipa' exact component={ProduksiPipa} authenticated />
              <DynamicRoute path='/laporan/mixer pipa' exact component={MixerPipa} authenticated />
              <DynamicRoute path='/laporan/quality control' exact component={QualityControl} authenticated />
              <DynamicRoute path='/laporan/stokist pipa' exact component={StokistPipa} authenticated />
              <DynamicRoute path='/laporan/armada' exact component={Armada} authenticated />
              <DynamicRoute path='/laporan/cat tegel' exact component={CatTegel} authenticated />
              <DynamicRoute path='/laporan/spandek' exact component={Spandek} authenticated />
              <DynamicRoute path='/laporan/hollow' exact component={Hollow} authenticated />
              <DynamicRoute path='/laporan/sekuriti' exact component={Sekuriti} authenticated />
              <DynamicRoute path='/laporan/sales' exact component={Sales} authenticated />
              <DynamicRoute path='/laporan/detail sales' exact component={DetailSales} authenticated />
              <DynamicRoute path='/laporan/detail sekuriti' exact component={DetailSekuriti} authenticated />
              <DynamicRoute path='/laporan/detail armada' exact component={DetailArmada} authenticated />
              <DynamicRoute path='/laporan/detail stokist pipa' exact component={DetailStokistPipa} authenticated />
              <DynamicRoute path='/laporan/detail quality control pipa' exact component={DetailQualityControlPipa} authenticated />
              <DynamicRoute path='/laporan/detail produksi pipa' exact component={DetailProduksiPipa} authenticated />
              <DynamicRoute path='/laporan/detail cat tegel' exact component={DetailCatTegel} authenticated />
              <DynamicRoute path='/laporan/detail mixer pipa' exact component={DetailMixerPipa} authenticated />
              <DynamicRoute path='/profil' exact component={Profil} authenticated />
              <DynamicRoute path='/ubah password' exact component={UbahPassword} authenticated />

              
              <DynamicRoute path='/direktur/karyawan/register karyawan' exact component={RegisterKaryawanDirektur} authenticated />
              <DynamicRoute path='/direktur/karyawan/master karyawan' exact component={MasterKaryawanDirektur} authenticated />
              <DynamicRoute path='/direktur/karyawan/detail karyawan' exact component={DetailKaryawanDirektur} authenticated />
              <DynamicRoute path='/direktur/kontrak/master gaji' exact component={MasterGajiDirektur} authenticated />
              <DynamicRoute path='/direktur/kontrak/master iuran' exact component={MasterIuranDirektur} authenticated />
              <DynamicRoute path='/direktur/kontrak/master kontrak' exact component={MasterKontrakDirektur} authenticated />
              <DynamicRoute path='/direktur/kontrak/detail kontrak' exact component={DetailKontrakDirektur} authenticated />
              <DynamicRoute path='/direktur/kontrak/master pembayaran gaji' exact component={MasterPembayaranGajiDirektur} authenticated />
              <DynamicRoute path='/direktur/kontrak/detail pembayaran gaji' exact component={DetailPembayaranGajiDirektur} authenticated />
              <DynamicRoute path='/direktur/permintaan/permintaan pinjaman' exact component={PermintaanPinjamanDirektur} authenticated />
              <DynamicRoute path='/direktur/permintaan/detail pinjaman' exact component={DetailPinjamanDirektur} authenticated />
              <DynamicRoute path='/direktur/permintaan/daftar permintaan izin' exact component={PermintaanDirektur} authenticated />
              <DynamicRoute path='/direktur/permintaan/detail permintaan izin' exact component={DetailPermintaanDirektur} authenticated />
              <DynamicRoute path='/direktur/absensi/daftar' exact component={DaftarAbsensiDirektur} authenticated />
              <DynamicRoute path='/direktur/kuisioner/daftar tanggapan' exact component={DaftarTanggapanDirektur} authenticated />
              <DynamicRoute path='/direktur/kuisioner/master kuisioner' exact component={MasterKuisionerDirektur} authenticated />
              <DynamicRoute path='/direktur/kuisioner/detail kuisionerku' exact component={DetailKuisionerDirektur} authenticated />
              <DynamicRoute path='/direktur/kuisioner/detail distribusi' exact component={DetailDistribusiDirektur} authenticated />
              <DynamicRoute path='/direktur/penilaian/master index' exact component={MasterIndexDirektur} authenticated />
              <DynamicRoute path='/direktur/penilaian/daftar penilaian' exact component={DaftarPenilaianDirektur} authenticated />
              <DynamicRoute path='/direktur/penilaian/master nilai' exact component={MasterNilaiDirektur} authenticated />
              <DynamicRoute path='/direktur/izin/master izin' exact component={MasterIzinDirektur} authenticated />
              <DynamicRoute path='/direktur/promosi/daftar permintaan promosi' exact component={DaftarPermintaanPromosi} authenticated />
              <DynamicRoute path='/direktur/surat/daftar surat keterangan' exact component={DaftarSuratPerintahDirektur} authenticated />
              <DynamicRoute path='/direktur/surat/detail surat' exact component={DetailSuratPerintahDirektur} authenticated />
              <DynamicRoute path='/direktur/surat/daftar surat perintah' exact component={PermintaanSuratDirektur} authenticated />
              <DynamicRoute path='/direktur/surat/detail surat perintah' exact component={DetailSuratDirektur} authenticated />
              <DynamicRoute path='/logout' exact logout />
            </Switch>
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
