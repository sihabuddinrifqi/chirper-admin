<?php

namespace App\Http\Controllers;

use App\Models\Chirp;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StatisticController extends Controller
{

    public function index()
    {
        return Inertia::render('Admin/Statistics/Index',[
            'user' => Auth::user(),
            'title' => 'Belajar Laravel Bootcamp Inertia - Najma',
        ]);
    }
    
    /*
    DATABASE QUERY BUILDER

    di fitur statistik ini, kita butuh query data secara dinamis tergantung filter startDate & endDate
    oleh karena itu kita butuh query builder, agar pembuatan query bisa berubah secara dinamis tergantung filternya

    fitur statistik ini ada
    - statistik jumlah pengguna aktif
    - jumlah chrip yang diposting harian/mingguan/bulanan 
    - jumlah laporan pelanggaran
    */

    
    /*
    REQUEST QUERY STRING
    
    contoh: example.com/statistics?start_date=2025-01-01&end_date=2025-02-01&some_query=value
    ciri-cirinya, ada tanda ? setelah path url
    untuk menggabungkan beberapa query, pake simbol &
    query string ini tidak wajib.

    kita bisa define query string di laravel pakai object Request dengan method query()

    method query() diatas menerima 2 parameter, yaitu key & default
    - key adalah nama query string yang akan kita buat
    = default adalah default value dari query string tsb apabila value-nya tidak di set secara explisit di url
    */

    public function getUserStatistics(Request $request)
    {
        $startDate = $request->query('start_date', null);
        $endDate = $request->query('end_date', null);
        $isActive = $request->query('is_active', '1');

        /* bikin default filter secara dinamis
         dihitung seminggu terakhir dari hari ini
         kenapa tidak di parameter "default" karena disitu hardcode, ngga bisa dinamis
         pake function getLastWeek
        */

        // panggil function untuk mengambil tanggal 7 hari terakhir
        $getLastWeekData = $this->getLastWeek();

        if($startDate == null) {
            $startDate = $getLastWeekData['start_date'];
        }

        if($endDate == null) {
            $endDate = $getLastWeekData['end_date'];
        }

        // QUERY BUILDER
        // untuk mengambil data user
        $query = User::query();

        // mulai filter berdasarkan request query
        if(($isActive == '1') || ($isActive == 'true')) {
            $query->where('is_active', '=',true);
        }

        if(($isActive == '0') || ($isActive == 'false')) {
            $query->where('is_active', '=',false);
        }
        
        if($isActive == 'all') {
            // ngga perlu di filter
        }

        // jika startdate di set
        if($startDate) {
            $query->where('created_at', '>=', $startDate);
        }

        // jik enddate di set
        if($endDate) {
            $query->where('created_at', '<=', $endDate);
        }

        // ambil semua data user
        $users = $query->get();

        $jmlUser = count($users); // atau $users->count();

        /* return json
         kenapa return json bukan return inertia/view()
         karena untuk mempermudah handling tampilan statistiknya di frontend
         backend cuma return data json, kemudian frontend bisa berkreasi membuat tampilan statistik yang lebih interaktif
         selain itu frontend juga bisa menambahkan library untuk chart/dll

         di frontend memanggil function ini menggunakan AJAX (asynchronous javascript). 
         yang artinya front end bisa memanggil function ini tanpa harus reload halamannya
         umumnya menggunakan function fetch() yang tersedia di javascript, atau pakai library seperti AXIOS dan JQuery
        */

         $data =[
            'users' => $users,
            'count' => $jmlUser,
        ];

        // data => data yang dikirim
        // status => HTTP STATUS CODE

        return response()->json($data, 200);
    }

    // function get chrips
    public function getChirpStatistics(Request $request)
    {
        // querystring
        $startDate = $request->query('start_date', null);
        $endDate = $request->query('end_date', null);

        // query
        $query = Chirp::query();

         // filter date time
        // jika startdate di set
        if($startDate) {
            $query->where('created_at', '>=', $startDate);
        }

        // jik enddate di set
        if($endDate) {
            $query->where('created_at', '<=', $endDate);
        }

        $chrips = $query->get();
        $jmlChrips = count($chrips);

        $data = [
           'chirps' => $chrips,
           'count' => $jmlChrips,
        ];

        return response()->json($data, 200);
    }

    public function getReportStatistics(Request $request)
    {
        $startDate = $request->query('start_date', null);
        $endDate = $request->query('end_date', null);
        $isResolved = $request->query('is_resolved', null);
        // panggil function untuk mengambil tanggal 7 hari terakhir
        $getLastWeekData = $this->getLastWeek();
        if($startDate == null) {
            $startDate = $getLastWeekData['start_date'];
        }
        if($endDate == null) {
            $endDate = $getLastWeekData['end_date'];
        }
        $query = Report::query();
        if($startDate) {
            $query->where('created_at', '>=', $startDate);
        }
        if($endDate) {
            $query->where('created_at', '<=', $endDate);
        }
        if(($isResolved == '1') || ($isResolved == 'true')) {
            $query->where('is_resolved', '=',true);
        }
        if(($isResolved == '0') || ($isResolved == 'false')) {
            $query->where('is_resolved', '=',false);
        }
        $reports = $query->get();
        $jmlReports = count($reports);

        $data = [
            'reports' => $reports,
            'count' => $jmlReports,
         ];
         return response()->json($data, 200);
    }

    private function getLastWeek()
    {
        $today = Carbon::today(); // Tanggal hari ini
        $last7Days = Carbon::today()->subDays(6); // 7 hari terakhir (hari ini - 6 hari)

        return [
            'start_date' => $last7Days->toDateString(), // Format: YYYY-MM-DD
            'end_date' => $today->toDateString(), // Format: YYYY-MM-DD
        ];
    }
}
