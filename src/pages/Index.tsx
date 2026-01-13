import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState('us-east-1');
  const [isPremium, setIsPremium] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(30);
  const [securitySettings, setSecuritySettings] = useState({
    'AES-256 шифрование': true,
    'SSL сертификат': true,
    '2FA аутентификация': true,
    'Kill Switch': false,
  });
  const [vpnConfig, setVpnConfig] = useState({
    protocol: 'WireGuard',
    encryption: 'AES-256-GCM',
    port: '51820',
    dns: 'Cloudflare',
    ipVersion: 'IPv4',
  });
  const [outlineKey, setOutlineKey] = useState('');
  const [outlineKeys, setOutlineKeys] = useState<Array<{id: string, name: string, key: string, created: string}>>([]);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedKeyForQR, setSelectedKeyForQR] = useState('');

  const servers = [
    { id: 'us-east-1', name: 'США (Восток)', country: 'USA', city: 'Нью-Йорк', load: 45, ping: 12, type: 'Выделенный', status: 'online' },
    { id: 'eu-central-1', name: 'Германия', country: 'Germany', city: 'Франкфурт', load: 32, ping: 28, type: 'Общий', status: 'online' },
    { id: 'asia-east-1', name: 'Япония', country: 'Japan', city: 'Токио', load: 68, ping: 145, type: 'Облачный', status: 'online' },
    { id: 'eu-west-1', name: 'Великобритания', country: 'UK', city: 'Лондон', load: 52, ping: 35, type: 'Выделенный', status: 'online' },
    { id: 'asia-south-1', name: 'Сингапур', country: 'Singapore', city: 'Сингапур', load: 41, ping: 178, type: 'Общий', status: 'online' },
    { id: 'us-west-1', name: 'США (Запад)', country: 'USA', city: 'Сан-Франциско', load: 25, ping: 85, type: 'Облачный', status: 'online' },
  ];

  const securityStatus = [
    { name: 'AES-256 шифрование', icon: 'Shield' },
    { name: 'SSL сертификат', icon: 'Lock' },
    { name: '2FA аутентификация', icon: 'KeyRound' },
    { name: 'Kill Switch', icon: 'Power' },
  ];

  const stats = [
    { label: 'Активные сессии', value: '142', change: '+12%', icon: 'Users' },
    { label: 'Использовано трафика', value: '2.4 ТБ', change: '+8%', icon: 'HardDrive' },
    { label: 'Доступные серверы', value: '68', change: '0%', icon: 'Server' },
    { label: 'Время работы', value: '99.9%', change: '+0.1%', icon: 'Activity' },
  ];

  const recentActivity = [
    { user: 'admin@company.com', action: 'Подключение к US-East-1', time: '2 мин назад', status: 'success' },
    { user: 'user@company.com', action: 'Отключение от EU-Central-1', time: '15 мин назад', status: 'info' },
    { user: 'tech@company.com', action: 'Сбой подключения Asia-East-1', time: '1 час назад', status: 'error' },
    { user: 'manager@company.com', action: 'Подключение к UK-West-1', time: '2 часа назад', status: 'success' },
  ];

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const handlePremiumPurchase = () => {
    setIsPremium(true);
    setTrialDaysLeft(0);
    toast.success('Подписка Premium активирована!', {
      description: 'Теперь у вас есть доступ ко всем возможностям DominoVPN'
    });
  };

  const activateTrial = () => {
    setIsPremium(true);
    toast.success('Пробный период активирован!', {
      description: 'У вас есть 30 дней бесплатного доступа к Premium'
    });
  };

  const handleNotifications = () => {
    toast.info('Уведомления', {
      description: 'У вас нет новых уведомлений'
    });
  };

  const handleSettings = () => {
    toast.info('Настройки', {
      description: 'Раздел настроек в разработке'
    });
  };

  const toggleSecurity = (name: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
    toast.success(
      securitySettings[name] ? 'Отключено' : 'Включено',
      { description: name }
    );
  };

  const updateVpnConfig = (key: string, value: string) => {
    setVpnConfig(prev => ({ ...prev, [key]: value }));
    toast.success('Конфигурация обновлена', {
      description: `${key}: ${value}`
    });
  };

  const addOutlineKey = () => {
    if (!outlineKey.trim()) {
      toast.error('Ошибка', { description: 'Введите ключ доступа Outline' });
      return;
    }
    if (!outlineKey.startsWith('ss://')) {
      toast.error('Неверный формат', { description: 'Ключ должен начинаться с ss://' });
      return;
    }
    const newKey = {
      id: Date.now().toString(),
      name: `Сервер ${outlineKeys.length + 1}`,
      key: outlineKey,
      created: new Date().toLocaleString('ru-RU')
    };
    setOutlineKeys(prev => [...prev, newKey]);
    setOutlineKey('');
    toast.success('Ключ добавлен!', { description: 'Теперь можно сгенерировать QR-код' });
  };

  const deleteOutlineKey = (id: string) => {
    setOutlineKeys(prev => prev.filter(k => k.id !== id));
    toast.success('Ключ удален');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
  };

  const showQRCode = (key: string) => {
    setSelectedKeyForQR(key);
    setShowQRDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Shield" className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">DominoVPN</h1>
                <p className="text-sm text-muted-foreground">Корпоративная защита</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isPremium ? (
                <Badge className="gap-2 bg-accent">
                  <Icon name="Crown" size={14} />
                  Premium {trialDaysLeft > 0 && `• ${trialDaysLeft} дней`}
                </Badge>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Icon name="Crown" size={14} />
                      Купить Premium
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Icon name="Crown" className="text-accent" size={24} />
                        DominoVPN Premium
                      </DialogTitle>
                      <DialogDescription>
                        Получите максимальную защиту и скорость
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="Gift" className="text-accent" size={20} />
                          <span className="font-semibold text-accent">Специальное предложение</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Попробуйте Premium бесплатно в течение 30 дней</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-5xl font-bold mb-2">150 ₽</div>
                        <p className="text-muted-foreground">в месяц после пробного периода</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon name="Check" size={12} className="text-accent" />
                          </div>
                          <div>
                            <p className="font-medium">Безлимитный трафик</p>
                            <p className="text-sm text-muted-foreground">Без ограничений по объему данных</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon name="Check" size={12} className="text-accent" />
                          </div>
                          <div>
                            <p className="font-medium">Максимальная скорость</p>
                            <p className="text-sm text-muted-foreground">До 1 Гбит/с на выделенных серверах</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon name="Check" size={12} className="text-accent" />
                          </div>
                          <div>
                            <p className="font-medium">Приоритетная поддержка</p>
                            <p className="text-sm text-muted-foreground">Ответ в течение 15 минут</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon name="Check" size={12} className="text-accent" />
                          </div>
                          <div>
                            <p className="font-medium">Доступ к выделенным серверам</p>
                            <p className="text-sm text-muted-foreground">68 серверов в 32 странах</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon name="Check" size={12} className="text-accent" />
                          </div>
                          <div>
                            <p className="font-medium">Расширенная аналитика</p>
                            <p className="text-sm text-muted-foreground">Детальная статистика использования</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="flex-col gap-2 sm:flex-col">
                      <Button size="lg" className="w-full" onClick={activateTrial}>
                        <Icon name="Gift" className="mr-2" size={20} />
                        Начать пробный период
                      </Button>
                      <Button size="lg" variant="outline" className="w-full" onClick={handlePremiumPurchase}>
                        <Icon name="CreditCard" className="mr-2" size={20} />
                        Оплатить сразу 150 ₽
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="ghost" size="icon" onClick={handleNotifications}>
                <Icon name="Bell" size={20} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSettings}>
                <Icon name="Settings" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Статус подключения</CardTitle>
                  <CardDescription>Управление VPN соединением</CardDescription>
                </div>
                <Badge className={isConnected ? 'bg-accent' : 'bg-muted'}>
                  {isConnected ? 'Подключено' : 'Отключено'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 space-y-6">
                <div className="relative">
                  <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center transition-all ${
                    isConnected ? 'border-accent bg-accent/10' : 'border-muted bg-muted/10'
                  }`}>
                    <Icon name={isConnected ? 'ShieldCheck' : 'ShieldOff'} size={48} className={isConnected ? 'text-accent' : 'text-muted-foreground'} />
                  </div>
                  {isConnected && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full animate-pulse" />
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    {isConnected ? servers.find(s => s.id === selectedServer)?.name : 'Не подключено'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isConnected ? `IP: 185.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` : 'Выберите сервер для подключения'}
                  </p>
                </div>

                <Button 
                  size="lg" 
                  className="w-48 h-12"
                  onClick={handleConnect}
                  variant={isConnected ? 'destructive' : 'default'}
                >
                  <Icon name={isConnected ? 'Power' : 'Zap'} className="mr-2" size={20} />
                  {isConnected ? 'Отключиться' : 'Подключиться'}
                </Button>

                {isConnected && (
                  <div className="w-full grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <Icon name="Download" className="mx-auto mb-1 text-primary" size={20} />
                      <p className="text-sm font-medium">124.5 Мб/с</p>
                      <p className="text-xs text-muted-foreground">Скачивание</p>
                    </div>
                    <div className="text-center">
                      <Icon name="Upload" className="mx-auto mb-1 text-primary" size={20} />
                      <p className="text-sm font-medium">89.2 Мб/с</p>
                      <p className="text-xs text-muted-foreground">Загрузка</p>
                    </div>
                    <div className="text-center">
                      <Icon name="Clock" className="mx-auto mb-1 text-primary" size={20} />
                      <p className="text-sm font-medium">02:34:12</p>
                      <p className="text-xs text-muted-foreground">Время сессии</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Безопасность</CardTitle>
              <CardDescription>Статус защиты данных</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityStatus.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      securitySettings[item.name] ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon name={item.icon as any} size={16} />
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <Switch 
                    checked={securitySettings[item.name]} 
                    onCheckedChange={() => toggleSecurity(item.name)}
                  />
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Уровень защиты</span>
                  <Badge className="bg-accent">
                    {Object.values(securitySettings).filter(Boolean).length === 4 ? 'Максимальный' : 
                     Object.values(securitySettings).filter(Boolean).length >= 2 ? 'Средний' : 'Низкий'}
                  </Badge>
                </div>
                <Progress value={(Object.values(securitySettings).filter(Boolean).length / 4) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name={stat.icon as any} className="text-primary" size={24} />
                  </div>
                  <Badge variant={stat.change.startsWith('+') ? 'default' : 'secondary'} className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8 border-accent/50 bg-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Download" className="text-accent" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Скачать VPN клиент для реального подключения</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Для разблокировки YouTube, Instagram и других сервисов установите настоящий VPN-клиент на ваше устройство
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-auto py-3 flex-col gap-2"
                    onClick={() => window.open('https://www.wireguard.com/install/', '_blank')}
                  >
                    <Icon name="Smartphone" size={24} className="text-primary" />
                    <div className="text-center">
                      <p className="font-semibold text-xs">WireGuard</p>
                      <p className="text-xs text-muted-foreground">iOS/Android</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-3 flex-col gap-2"
                    onClick={() => window.open('https://www.wireguard.com/install/', '_blank')}
                  >
                    <Icon name="Laptop" size={24} className="text-primary" />
                    <div className="text-center">
                      <p className="font-semibold text-xs">WireGuard</p>
                      <p className="text-xs text-muted-foreground">Windows/Mac</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-3 flex-col gap-2"
                    onClick={() => window.open('https://openvpn.net/client/', '_blank')}
                  >
                    <Icon name="Shield" size={24} className="text-blue-500" />
                    <div className="text-center">
                      <p className="font-semibold text-xs">OpenVPN</p>
                      <p className="text-xs text-muted-foreground">Все платформы</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-3 flex-col gap-2"
                    onClick={() => window.open('https://getoutline.org/', '_blank')}
                  >
                    <Icon name="Key" size={24} className="text-accent" />
                    <div className="text-center">
                      <p className="font-semibold text-xs">Outline</p>
                      <p className="text-xs text-muted-foreground">Простой VPN</p>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="outline" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="outline">Outline VPN</TabsTrigger>
            <TabsTrigger value="servers">Серверы</TabsTrigger>
            <TabsTrigger value="config">Конфигурация</TabsTrigger>
            <TabsTrigger value="activity">Активность</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>

          <TabsContent value="outline" className="space-y-6">
            <Card className="border-accent/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Icon name="Key" className="text-accent" size={24} />
                  </div>
                  <div>
                    <CardTitle>Подключение к Outline VPN</CardTitle>
                    <CardDescription>Управление вашим собственным Outline сервером</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Icon name="Info" className="text-accent mt-0.5" size={20} />
                    <div className="flex-1">
                      <p className="font-semibold mb-2 text-accent">У вас есть Outline сервер?</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Добавьте ключи доступа к вашему Outline серверу, чтобы создать QR-коды и ссылки для быстрого подключения.
                        Ваши пользователи смогут подключиться к VPN за считанные секунды.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ключ выглядит примерно так: <code className="bg-muted px-1 py-0.5 rounded">ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpwYXNzd29yZA==@1.2.3.4:8388/?outline=1</code>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="outline-key">Ключ доступа Outline</Label>
                    <div className="flex gap-2">
                      <Textarea 
                        id="outline-key"
                        placeholder="ss://..."
                        value={outlineKey}
                        onChange={(e) => setOutlineKey(e.target.value)}
                        className="font-mono text-sm min-h-[80px]"
                      />
                    </div>
                  </div>
                  <Button onClick={addOutlineKey} className="w-full" size="lg">
                    <Icon name="Plus" className="mr-2" size={20} />
                    Добавить ключ доступа
                  </Button>
                </div>

                {outlineKeys.length > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Icon name="List" size={18} />
                      Сохраненные ключи ({outlineKeys.length})
                    </h4>
                    {outlineKeys.map((item) => (
                      <Card key={item.id} className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <p className="font-semibold mb-1">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Добавлен: {item.created}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => deleteOutlineKey(item.id)}
                            >
                              <Icon name="Trash2" size={16} className="text-destructive" />
                            </Button>
                          </div>
                          <div className="bg-background rounded p-3 mb-3">
                            <p className="text-xs font-mono break-all text-muted-foreground">{item.key}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => showQRCode(item.key)}
                            >
                              <Icon name="QrCode" className="mr-2" size={16} />
                              QR-код
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => copyToClipboard(item.key)}
                            >
                              <Icon name="Copy" className="mr-2" size={16} />
                              Копировать
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Как подключиться к Outline VPN?</CardTitle>
                <CardDescription>Инструкция для пользователей</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 font-bold text-primary">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-1">Скачайте Outline Client</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Установите приложение Outline на ваше устройство
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open('https://itunes.apple.com/app/outline-app/id1356177741', '_blank')}
                        >
                          <Icon name="Smartphone" className="mr-2" size={14} />
                          iOS
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open('https://play.google.com/store/apps/details?id=org.outline.android.client', '_blank')}
                        >
                          <Icon name="Smartphone" className="mr-2" size={14} />
                          Android
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open('https://getoutline.org/', '_blank')}
                        >
                          <Icon name="Laptop" className="mr-2" size={14} />
                          Windows/Mac
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 font-bold text-primary">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-1">Получите ключ доступа</p>
                      <p className="text-sm text-muted-foreground">
                        Нажмите "QR-код" у нужного ключа выше и отсканируйте его в приложении Outline, либо скопируйте ключ и вставьте в приложение вручную
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 font-bold text-accent">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-1">Подключитесь к VPN</p>
                      <p className="text-sm text-muted-foreground">
                        Откройте Outline Client и нажмите кнопку "Подключиться". Теперь вы можете безопасно пользоваться интернетом и получить доступ к заблокированным сервисам
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Глобальная сеть серверов</CardTitle>
                <CardDescription>68 серверов в 32 странах мира</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servers.map((server) => (
                    <Card 
                      key={server.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedServer === server.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedServer(server.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                              🌍
                            </div>
                            <div>
                              <h4 className="font-semibold">{server.name}</h4>
                              <p className="text-xs text-muted-foreground">{server.city}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{server.type}</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Загрузка</span>
                            <span className="font-medium">{server.load}%</span>
                          </div>
                          <Progress value={server.load} className="h-1.5" />
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1 text-sm">
                              <Icon name="Wifi" size={14} className="text-accent" />
                              <span className="text-muted-foreground">{server.ping}ms</span>
                            </div>
                            <Badge className="bg-accent text-xs">Online</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Протокол и шифрование</CardTitle>
                  <CardDescription>Настройки подключения к VPN</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="protocol">Протокол VPN</Label>
                    <Select value={vpnConfig.protocol} onValueChange={(value) => updateVpnConfig('protocol', value)}>
                      <SelectTrigger id="protocol">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WireGuard">
                          <div className="flex items-center gap-2">
                            <Icon name="Zap" size={14} className="text-accent" />
                            WireGuard (Рекомендуется)
                          </div>
                        </SelectItem>
                        <SelectItem value="OpenVPN">
                          <div className="flex items-center gap-2">
                            <Icon name="Shield" size={14} className="text-primary" />
                            OpenVPN
                          </div>
                        </SelectItem>
                        <SelectItem value="IKEv2">
                          <div className="flex items-center gap-2">
                            <Icon name="Smartphone" size={14} className="text-blue-500" />
                            IKEv2/IPsec
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {vpnConfig.protocol === 'WireGuard' && 'Быстрый и современный протокол с минимальной задержкой'}
                      {vpnConfig.protocol === 'OpenVPN' && 'Надежный протокол с высоким уровнем безопасности'}
                      {vpnConfig.protocol === 'IKEv2' && 'Оптимален для мобильных устройств'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="encryption">Тип шифрования</Label>
                    <Select value={vpnConfig.encryption} onValueChange={(value) => updateVpnConfig('encryption', value)}>
                      <SelectTrigger id="encryption">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AES-256-GCM">AES-256-GCM</SelectItem>
                        <SelectItem value="AES-256-CBC">AES-256-CBC</SelectItem>
                        <SelectItem value="ChaCha20">ChaCha20-Poly1305</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Военный уровень шифрования данных</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="port">Порт подключения</Label>
                    <Select value={vpnConfig.port} onValueChange={(value) => updateVpnConfig('port', value)}>
                      <SelectTrigger id="port">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="51820">51820 (WireGuard)</SelectItem>
                        <SelectItem value="1194">1194 (OpenVPN UDP)</SelectItem>
                        <SelectItem value="443">443 (HTTPS)</SelectItem>
                        <SelectItem value="500">500 (IKEv2)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Порт 443 обходит большинство файрволов</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Сетевые настройки</CardTitle>
                  <CardDescription>DNS и IP конфигурация</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="dns">DNS сервер</Label>
                    <Select value={vpnConfig.dns} onValueChange={(value) => updateVpnConfig('dns', value)}>
                      <SelectTrigger id="dns">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cloudflare">
                          <div className="flex items-center gap-2">
                            <Icon name="Cloud" size={14} />
                            Cloudflare (1.1.1.1)
                          </div>
                        </SelectItem>
                        <SelectItem value="Google">
                          <div className="flex items-center gap-2">
                            <Icon name="Globe" size={14} />
                            Google (8.8.8.8)
                          </div>
                        </SelectItem>
                        <SelectItem value="OpenDNS">
                          <div className="flex items-center gap-2">
                            <Icon name="Server" size={14} />
                            OpenDNS
                          </div>
                        </SelectItem>
                        <SelectItem value="Custom">
                          <div className="flex items-center gap-2">
                            <Icon name="Settings" size={14} />
                            Пользовательский
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Защищенные DNS-запросы без утечек</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ipVersion">Версия IP протокола</Label>
                    <Select value={vpnConfig.ipVersion} onValueChange={(value) => updateVpnConfig('ipVersion', value)}>
                      <SelectTrigger id="ipVersion">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IPv4">IPv4</SelectItem>
                        <SelectItem value="IPv6">IPv6</SelectItem>
                        <SelectItem value="Dual">Dual Stack (IPv4 + IPv6)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">IPv4 обеспечивает максимальную совместимость</p>
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">MTU размер пакета</p>
                        <p className="text-xs text-muted-foreground">1420 байт</p>
                      </div>
                      <Badge variant="outline">Авто</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Keepalive интервал</p>
                        <p className="text-xs text-muted-foreground">25 секунд</p>
                      </div>
                      <Badge variant="outline">Оптимально</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Реконнект при обрыве</p>
                        <p className="text-xs text-muted-foreground">Автоматически</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Текущая конфигурация</CardTitle>
                <CardDescription>Параметры активного подключения</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Протокол:</span>
                    <span className="font-semibold text-accent">{vpnConfig.protocol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Шифрование:</span>
                    <span className="font-semibold">{vpnConfig.encryption}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Порт:</span>
                    <span className="font-semibold">{vpnConfig.port}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DNS:</span>
                    <span className="font-semibold">{vpnConfig.dns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP версия:</span>
                    <span className="font-semibold">{vpnConfig.ipVersion}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground">Статус:</span>
                    <Badge className="bg-accent">Оптимизировано</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Недавняя активность</CardTitle>
                <CardDescription>Журнал подключений пользователей</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'success' ? 'bg-accent' : 
                        activity.status === 'error' ? 'bg-destructive' : 'bg-primary'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{activity.user}</p>
                          <Badge variant="outline" className="text-xs">{activity.time}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Использование трафика</CardTitle>
                  <CardDescription>За последние 7 дней</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => {
                      const value = Math.floor(Math.random() * 100);
                      return (
                        <div key={day} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{day}</span>
                            <span className="text-muted-foreground">{(value * 3.5).toFixed(1)} ГБ</span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Популярные серверы</CardTitle>
                  <CardDescription>По количеству подключений</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {servers.slice(0, 5).map((server, index) => {
                      const connections = Math.floor(Math.random() * 50) + 10;
                      return (
                        <div key={server.id} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{server.name}</span>
                              <span className="text-sm text-muted-foreground">{connections} подключений</span>
                            </div>
                            <Progress value={(connections / 60) * 100} className="h-1.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Icon name="QrCode" className="text-accent" size={24} />
                QR-код для подключения
              </DialogTitle>
              <DialogDescription>
                Отсканируйте этот код в приложении Outline Client
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center py-6 space-y-4">
              <div className="bg-white p-6 rounded-lg">
                <QRCodeSVG 
                  value={selectedKeyForQR} 
                  size={256}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <div className="w-full bg-muted/50 rounded-lg p-4">
                <p className="text-xs font-mono break-all text-center">{selectedKeyForQR}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => copyToClipboard(selectedKeyForQR)} className="flex-1">
                <Icon name="Copy" className="mr-2" size={16} />
                Копировать ключ
              </Button>
              <Button onClick={() => setShowQRDialog(false)} className="flex-1">
                Закрыть
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Index;