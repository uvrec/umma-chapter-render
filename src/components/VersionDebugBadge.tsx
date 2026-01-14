/**
 * Version Debug Badge
 * Показує діагностичну інформацію про версію для налагодження проблем з кешуванням
 *
 * Інформація:
 * - Build version (з коду, інжектується Vite)
 * - Server version (з /version.json)
 * - Service Worker статус
 * - Час останньої перевірки
 */

import { useState, useEffect } from 'react';
import { RefreshCw, Check, AlertTriangle, X, Server, Code, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

declare const __BUILD_VERSION__: string;

interface VersionInfo {
  buildVersion: string;
  serverVersion: string | null;
  storedVersion: string | null;
  lastReload: string | null;
  swStatus: 'active' | 'waiting' | 'none' | 'checking';
  swScope: string | null;
  lastCheck: Date | null;
  isOutdated: boolean;
}

export function VersionDebugBadge() {
  const { t } = useLanguage();
  const [info, setInfo] = useState<VersionInfo>({
    buildVersion: typeof __BUILD_VERSION__ !== 'undefined' ? __BUILD_VERSION__ : 'dev',
    serverVersion: null,
    storedVersion: null,
    lastReload: null,
    swStatus: 'checking',
    swScope: null,
    lastCheck: null,
    isOutdated: false,
  });
  const [isChecking, setIsChecking] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Завантажуємо інформацію
  const loadVersionInfo = async () => {
    setIsChecking(true);

    const buildVersion = typeof __BUILD_VERSION__ !== 'undefined' ? __BUILD_VERSION__ : 'dev';
    const storedVersion = localStorage.getItem('vv_build_version');
    const serverVersion = localStorage.getItem('vv_server_version');
    const lastReloadTime = localStorage.getItem('vv_last_reload_time');
    const lastReload = lastReloadTime
      ? new Date(parseInt(lastReloadTime, 10)).toLocaleString('uk-UA')
      : null;

    // Перевіряємо SW статус
    let swStatus: VersionInfo['swStatus'] = 'none';
    let swScope: string | null = null;

    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        if (registrations.length > 0) {
          const reg = registrations[0];
          swScope = reg.scope;
          if (reg.waiting) {
            swStatus = 'waiting';
          } else if (reg.active) {
            swStatus = 'active';
          }
        }
      } catch (e) {
        console.warn('[VersionDebug] SW check error:', e);
      }
    }

    // Перевіряємо серверну версію
    let latestServerVersion = serverVersion;
    if (buildVersion !== 'dev') {
      try {
        const response = await fetch('/version.json', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (response.ok) {
          const data = await response.json();
          latestServerVersion = data.build;
          localStorage.setItem('vv_server_version', data.build);
        }
      } catch (e) {
        console.warn('[VersionDebug] version.json fetch error:', e);
      }
    }

    const isOutdated = latestServerVersion !== null && latestServerVersion !== buildVersion;

    setInfo({
      buildVersion,
      serverVersion: latestServerVersion,
      storedVersion,
      lastReload,
      swStatus,
      swScope,
      lastCheck: new Date(),
      isOutdated,
    });

    setIsChecking(false);
  };

  useEffect(() => {
    loadVersionInfo();
  }, []);

  const handleForceUpdate = async () => {
    // Очищаємо кеші
    if ('caches' in window) {
      const names = await caches.keys();
      await Promise.all(names.map(name => caches.delete(name)));
    }

    // Unregister SW
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
    }

    // Reload
    location.reload();
  };

  const formatVersion = (version: string) => {
    // Скорочуємо ISO timestamp для зручності
    if (version.includes('T')) {
      const date = new Date(version);
      return date.toLocaleString('uk-UA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return version;
  };

  const getSwStatusIcon = () => {
    switch (info.swStatus) {
      case 'active':
        return <Check className="h-3 w-3 text-green-500" />;
      case 'waiting':
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
      case 'none':
        return <X className="h-3 w-3 text-gray-400" />;
      default:
        return <RefreshCw className="h-3 w-3 animate-spin" />;
    }
  };

  const getSwStatusText = () => {
    switch (info.swStatus) {
      case 'active':
        return t('активний', 'active');
      case 'waiting':
        return t('очікує', 'waiting');
      case 'none':
        return t('відсутній', 'none');
      default:
        return t('перевірка...', 'checking...');
    }
  };

  return (
    <div className="text-xs space-y-2">
      {/* Компактний заголовок */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-full"
      >
        <Code className="h-3 w-3" />
        <span className="font-mono">{formatVersion(info.buildVersion)}</span>
        {info.isOutdated && (
          <span className="text-yellow-500 ml-auto">{t('Нова версія!', 'Update available!')}</span>
        )}
      </button>

      {/* Розгорнута інформація */}
      {expanded && (
        <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-muted-foreground">
          {/* Build version */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              {t('Код:', 'Code:')}
            </span>
            <span className="font-mono text-foreground">{formatVersion(info.buildVersion)}</span>
          </div>

          {/* Server version */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1">
              <Server className="h-3 w-3" />
              {t('Сервер:', 'Server:')}
            </span>
            <span className={cn(
              'font-mono',
              info.isOutdated ? 'text-yellow-500' : 'text-foreground'
            )}>
              {info.serverVersion ? formatVersion(info.serverVersion) : '—'}
            </span>
          </div>

          {/* SW status */}
          <div className="flex items-center justify-between gap-2">
            <span>Service Worker:</span>
            <span className="flex items-center gap-1">
              {getSwStatusIcon()}
              {getSwStatusText()}
            </span>
          </div>

          {/* Last reload */}
          {info.lastReload && (
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {t('Останній reload:', 'Last reload:')}
              </span>
              <span className="font-mono">{info.lastReload}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadVersionInfo}
              disabled={isChecking}
              className="flex-1 h-7 text-xs"
            >
              <RefreshCw className={cn('h-3 w-3 mr-1', isChecking && 'animate-spin')} />
              {t('Перевірити', 'Check')}
            </Button>

            {info.isOutdated && (
              <Button
                variant="default"
                size="sm"
                onClick={handleForceUpdate}
                className="flex-1 h-7 text-xs"
              >
                {t('Оновити', 'Update')}
              </Button>
            )}
          </div>

          {/* Last check time */}
          {info.lastCheck && (
            <div className="text-center text-[10px] text-muted-foreground">
              {t('Перевірено:', 'Checked:')} {info.lastCheck.toLocaleTimeString('uk-UA')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
