<?php

namespace App\Providers;

use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        Gate::define('isAdmin', function ($user) { // var $user facultative var Laravel le fait implicitement

            return $user->type === 'admin';
        });

        Gate::define('isAuthor', function ($user) { // var $user facultative var Laravel le fait implicitement

            return $user->type === 'author';
        });

        Gate::define('isUser', function ($user) { // var $user facultative var Laravel le fait implicitement

            return $user->type === 'user';
        });


        $this->registerPolicies();

        Passport::routes();
    }
}
