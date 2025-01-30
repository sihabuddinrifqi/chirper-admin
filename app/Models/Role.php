<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    protected $fillable = [
        'name'
    ];

    // kode untuk relasi ke model User (many-to-many)
    public function users() : BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
