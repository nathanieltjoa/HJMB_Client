import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as FIcons from 'react-icons/fi';
import * as MdIcons from 'react-icons/md';
import * as GoIcons from 'react-icons/go';

export const SidebarData = [
  {
    title: 'Dashboard',
    path: '/Dashboard',
    icon: <AiIcons.AiFillHome />,
  },
  {
    title: 'Karyawan',
    path: '#',
    icon: <FaIcons.FaUsers />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Register',
        path: '/karyawan/register',
        icon: <FIcons.FiUserPlus />,
        cName: 'sub-nav'
      },
      {
        title: 'Master Karyawan',
        path: '/karyawan/master karyawan',
        icon: <FaIcons.FaUserEdit />
      }
    ]
  },
  {
    title: 'Kontrak',
    path: '#',
    icon: <FaIcons.FaFileContract />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Master Gaji',
        path: '/kontrak/master Gaji',
        icon: <FaIcons.FaMoneyCheckAlt />,
        cName: 'sub-nav'
      },
      {
        title: 'Master Iuran',
        path: '/kontrak/master Iuran',
        icon: <FaIcons.FaMoneyCheckAlt />,
        cName: 'sub-nav'
      },
      {
        title: 'Master Kontrak',
        path: '/kontrak/master Kontrak',
        icon: <FaIcons.FaFileContract />,
        cName: 'sub-nav'
      },
      {
        title: 'Tambah Kontrak',
        path: '/kontrak/tambah Kontrak',
        icon: <FaIcons.FaFileSignature />,
        cName: 'sub-nav'
      },
      {
        title: 'Master Pembayaran Gaji',
        path: '/kontrak/master pembayaran gaji',
        icon: <FaIcons.FaFileSignature />,
        cName: 'sub-nav'
      },
      {
        title: 'Generate Slip Gaji',
        path: '/kontrak/generate slip gaji',
        icon: <FaIcons.FaFileSignature />,
        cName: 'sub-nav'
      },
    ]
  },
  {
    title: 'Permintaan',
    path: '#',
    icon: <FaIcons.FaWarehouse />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Daftar Izin',
        path: '/permintaan/permintaan izin',
        icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      },
      {
        title: 'Daftar Pinjaman',
        path: '/permintaan/permintaan pinjaman',
        icon: <FaIcons.FaWarehouse />,
        cName: 'sub-nav'
      },
    ]
  },
  {
    title: 'Penambahan',
    path: '#',
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Tambah Gudang',
        path: '/penambahan/tambah gudang',
        icon: <FaIcons.FaWarehouse />,
        cName: 'sub-nav'
      },
      {
        title: 'Tambah Group Divisi',
        path: '/penambahan/tambah group',
        icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      },
    ]
  },
  {
    title: 'Surat',
    path: '#',
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Tambah Surat Perintah',
        path: '/surat/tambah surat',
        icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      },
      {
        title: 'Daftar Surat Keterangan',
        path: '/surat/daftar surat keterangan',
        icon: <FaIcons.FaWarehouse />,
        cName: 'sub-nav'
      },
      {
        title: 'Daftar Surat Perintah',
        path: '/surat/daftar surat perintah',
        icon: <FaIcons.FaWarehouse />,
        cName: 'sub-nav'
      },
    ]
  },
  {
    title: 'Absensi',
    path: '#',
    icon: <FaIcons.FaUserCheck />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Tambah Absensi',
        path: '/absensi/tambah',
        icon: <FaIcons.FaUserCheck />,
        cName: 'sub-nav'
      },
      {
        title: 'Daftar Absensi',
        path: '/absensi/daftar',
        icon: <FaIcons.FaFileAlt />,
        cName: 'sub-nav'
      },
    ]
  },
  {
    title: 'Laporan',
    path: '#',
    icon: <FaIcons.FaUserCheck />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Produksi Pipa',
        path: '/laporan/produksi pipa',
        icon: <FaIcons.FaUserCheck />,
        cName: 'sub-nav'
      },
      {
        title: 'Mixer Pipa',
        path: '/laporan/mixer pipa',
        icon: <FaIcons.FaUserCheck />,
        cName: 'sub-nav'
      },
      {
        title: 'Quality Control',
        path: '/laporan/quality control',
        icon: <FaIcons.FaUserCheck />,
        cName: 'sub-nav'
      },
      {
        title: 'Stokist Pipa',
        path: '/laporan/stokist pipa',
        icon: <FaIcons.FaUserCheck />,
        cName: 'sub-nav'
      },
      {
        title: 'Armada',
        path: '/laporan/armada',
        icon: <FaIcons.FaUserCheck />,
        cName: 'sub-nav'
      },
      {
        title: 'Cat Tegel',
        path: '/laporan/cat tegel',
        icon: <FaIcons.FaUserCheck />,
        cName: 'sub-nav'
      },
      {
        title: 'Spandek',
        path: '/laporan/spandek',
        icon: <FaIcons.FaUserCheck />,
        cName: 'sub-nav'
      },
      {
        title: 'Hollow',
        path: '/laporan/hollow',
        icon: <FaIcons.FaUserCheck />,
        cName: 'sub-nav'
      },
      {
        title: 'Sekuriti',
        path: '/laporan/sekuriti',
        icon: <FaIcons.FaUserCheck />,
        cName: 'sub-nav'
      },
      {
        title: 'Sales',
        path: '/laporan/sales',
        icon: <FaIcons.FaUserCheck />,
        cName: 'sub-nav'
      },
    ]
  },
  {
    title: 'Kuisioner',
    path: '#',
    icon: <FaIcons.FaQuestionCircle />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Tambah Kuisioner',
        path: '/kuisioner/tambah kuisioner',
        icon: <FaIcons.FaQuestionCircle />,
        cName: 'sub-nav'
      },
      {
        title: 'Tambah Pertanyaan',
        path: '/kuisioner/tambah pertanyaan',
        icon: <FaIcons.FaQuestionCircle />,
        cName: 'sub-nav'
      },
      {
        title: 'Daftar Tanggapan',
        path: '/kuisioner/daftar tanggapan',
        icon: <MdIcons.MdFeedback />,
        cName: 'sub-nav'
      },
      {
        title: 'Master Kuisioner',
        path: '/kuisioner/master kuisioner',
        icon: <FaIcons.FaQuestionCircle />,
        cName: 'sub-nav'
      },
      {
        title: 'Isi Kuisioner',
        path: '/kuisioner/isi kuisioner',
        icon: <FaIcons.FaQuestionCircle />,
        cName: 'sub-nav'
      },
    ]
  },
  {
    title: 'Penilaian',
    path: '#',
    icon: <GoIcons.GoChecklist />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Tambah Penilaian',
        path: '/penilaian/tambah penilaian',
        icon: <GoIcons.GoChecklist />,
        cName: 'sub-nav'
      },
      {
        title: 'Master Index Penilaian',
        path: '/penilaian/master index',
        icon: <GoIcons.GoChecklist />,
        cName: 'sub-nav'
      },
      {
        title: 'Daftar Penilaian',
        path: '/penilaian/daftar penilaian',
        icon: <GoIcons.GoFile />,
        cName: 'sub-nav'
      },
      {
        title: 'Master Nilai',
        path: '/penilaian/master nilai',
        icon: <GoIcons.GoFile />,
        cName: 'sub-nav'
      },
    ]
  },
  {
    title: 'Izin',
    path: '#',
    icon: <FaIcons.FaCheck />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Master Izin',
        path: '/izin/master izin',
        icon: <FaIcons.FaCheck />,
        cName: 'sub-nav'
      },
    ]
  },
  {
    title: 'Profil',
    path: '/profil',
    icon: <FaIcons.FaUserCircle />,
  },
  {
    title: 'Logout',
    path: '/logout',
    icon: <FaIcons.FaSignOutAlt />,
  },
];