<?php

namespace Pterodactyl\Http\Controllers\Api\Application;

use Illuminate\Http\Response;
use Illuminate\Contracts\Console\Kernel;
use Pterodactyl\Services\Helpers\SettingsService;
use Pterodactyl\Traits\Helpers\AvailableLanguages;
use Pterodactyl\Exceptions\Model\DataValidationException;
use Pterodactyl\Exceptions\Repository\RecordNotFoundException;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;
use Pterodactyl\Transformers\Api\Application\SettingsTransformer;
use Pterodactyl\Http\Requests\Api\Application\Settings\UpdateSettingsRequest;

class SettingsController extends ApplicationApiController
{
    use AvailableLanguages;

    /**
     * VersionController constructor.
     */
    public function __construct(
        private readonly Kernel $kernel,
        private readonly SettingsService $settingsService,
        private readonly SettingsRepositoryInterface $settingsRepository
    ) {
        parent::__construct();
    }

    /**
     * Returns current settings of panel.
     */
    public function index(): array
    {
        return $this->fractal->item($this->settingsService->getCurrentSettings())->transformWith(SettingsTransformer::class)->toArray();
    }

    /**
     * Handle settings update.
     *
     * @throws DataValidationException
     * @throws RecordNotFoundException
     */
    public function update(UpdateSettingsRequest $request): Response
    {
        $data = $request->validated();

        foreach ($data as $key => $value) {
            $this->settingsRepository->set($key, $value);
        }

        $this->kernel->call('queue:clear');

        return response()->noContent();
    }
}
