import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState('us-east-1');

  const servers = [
    { id: 'us-east-1', name: 'США (Восток)', country: 'USA', city: 'Нью-Йорк', load: 45, ping: 12, type: 'Выделенный', status: 'online' },
    { id: 'eu-central-1', name: 'Германия', country: 'Germany', city: 'Франкфурт', load: 32, ping: 28, type: 'Общий', status: 'online' },
    { id: 'asia-east-1', name: 'Япония', country: 'Japan', city: 'Токио', load: 68, ping: 145, type: 'Облачный', status: 'online' },
    { id: 'eu-west-1', name: 'Великобритания', country: 'UK', city: 'Лондон', load: 52, ping: 35, type: 'Выделенный', status: 'online' },
    { id: 'asia-south-1', name: 'Сингапур', country: 'Singapore', city: 'Сингапур', load: 41, ping: 178, type: 'Общий', status: 'online' },
    { id: 'us-west-1', name: 'США (Запад)', country: 'USA', city: 'Сан-Франциско', load: 25, ping: 85, type: 'Облачный', status: 'online' },
  ];

  const securityStatus = [
    { name: 'AES-256 шифрование', status: 'active', icon: 'Shield' },
    { name: 'SSL сертификат', status: 'active', icon: 'Lock' },
    { name: '2FA аутентификация', status: 'active', icon: 'KeyRound' },
    { name: 'Kill Switch', status: 'inactive', icon: 'Power' },
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
                <h1 className="text-xl font-bold">Enterprise VPN</h1>
                <p className="text-sm text-muted-foreground">Корпоративная защита</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-2">
                <Icon name="Crown" size={14} />
                Premium
              </Badge>
              <Button variant="ghost" size="icon">
                <Icon name="Bell" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
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
                      item.status === 'active' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon name={item.icon as any} size={16} />
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <Switch checked={item.status === 'active'} />
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Уровень защиты</span>
                  <Badge className="bg-accent">Максимальный</Badge>
                </div>
                <Progress value={100} className="h-2" />
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

        <Tabs defaultValue="servers" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="servers">Серверы</TabsTrigger>
            <TabsTrigger value="activity">Активность</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>

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
      </main>
    </div>
  );
};

export default Index;
