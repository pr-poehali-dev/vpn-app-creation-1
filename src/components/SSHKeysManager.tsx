import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface SSHKey {
  id: string;
  name: string;
  type: 'RSA' | 'ED25519' | 'ECDSA';
  fingerprint: string;
  publicKey: string;
  privateKey: string;
  createdAt: string;
  lastUsed?: string;
}

const SSHKeysManager = () => {
  const { toast } = useToast();
  const [keys, setKeys] = useState<SSHKey[]>([
    {
      id: '1',
      name: 'Production Server',
      type: 'ED25519',
      fingerprint: 'SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8',
      publicKey: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl',
      privateKey: '-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAA...',
      createdAt: '2024-01-15',
      lastUsed: '2 часа назад'
    },
    {
      id: '2',
      name: 'Development Environment',
      type: 'RSA',
      fingerprint: 'SHA256:jZB8K7kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8',
      publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...',
      privateKey: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...',
      createdAt: '2024-01-10',
      lastUsed: '5 дней назад'
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState<'RSA' | 'ED25519' | 'ECDSA'>('ED25519');
  const [showPrivateKey, setShowPrivateKey] = useState<string | null>(null);

  const generateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Ошибка",
        description: "Укажите название для ключа",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const newKey: SSHKey = {
        id: Date.now().toString(),
        name: newKeyName,
        type: newKeyType,
        fingerprint: `SHA256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        publicKey: `ssh-${newKeyType.toLowerCase()} AAAAC3NzaC1${newKeyType.toLowerCase()}${Math.random().toString(36).substring(2, 50)}`,
        privateKey: `-----BEGIN ${newKeyType} PRIVATE KEY-----\n${Math.random().toString(36).substring(2, 50)}...\n-----END ${newKeyType} PRIVATE KEY-----`,
        createdAt: new Date().toLocaleDateString('ru-RU')
      };

      setKeys([newKey, ...keys]);
      setNewKeyName('');
      setIsGenerating(false);

      toast({
        title: "Ключ создан",
        description: `SSH ключ "${newKey.name}" успешно сгенерирован`
      });
    }, 1500);
  };

  const deleteKey = (id: string) => {
    const key = keys.find(k => k.id === id);
    setKeys(keys.filter(k => k.id !== id));
    toast({
      title: "Ключ удален",
      description: `SSH ключ "${key?.name}" удален из хранилища`
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: `${type} скопирован в буфер обмена`
    });
  };

  const downloadKey = (key: SSHKey, isPrivate: boolean) => {
    const content = isPrivate ? key.privateKey : key.publicKey;
    const filename = isPrivate ? `${key.name}_private.key` : `${key.name}_public.pub`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Ключ экспортирован",
      description: `Файл ${filename} загружен`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SSH Ключи</h2>
          <p className="text-muted-foreground">Управление ключами для безопасного подключения</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg">
              <Icon name="Plus" className="mr-2" size={20} />
              Создать ключ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Генерация SSH ключа</DialogTitle>
              <DialogDescription>
                Создайте новую пару ключей для подключения к серверам
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">Название ключа</Label>
                <Input
                  id="keyName"
                  placeholder="Production Server"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keyType">Тип ключа</Label>
                <Select value={newKeyType} onValueChange={(value: any) => setNewKeyType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ED25519">ED25519 (Рекомендуется)</SelectItem>
                    <SelectItem value="RSA">RSA 4096</SelectItem>
                    <SelectItem value="ECDSA">ECDSA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={generateKey} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                    Генерация...
                  </>
                ) : (
                  <>
                    <Icon name="Key" className="mr-2" size={16} />
                    Сгенерировать
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {keys.map((key) => (
          <Card key={key.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Key" size={20} className="text-primary" />
                    {key.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {key.type} • Создан {key.createdAt}
                  </CardDescription>
                </div>
                <Badge variant="outline">{key.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Отпечаток</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-muted px-3 py-2 rounded font-mono">
                    {key.fingerprint}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(key.fingerprint, 'Отпечаток')}
                  >
                    <Icon name="Copy" size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Публичный ключ</Label>
                <Textarea
                  value={key.publicKey}
                  readOnly
                  className="font-mono text-xs h-20 resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => copyToClipboard(key.publicKey, 'Публичный ключ')}
                  >
                    <Icon name="Copy" className="mr-2" size={14} />
                    Копировать
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => downloadKey(key, false)}
                  >
                    <Icon name="Download" className="mr-2" size={14} />
                    Скачать
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Приватный ключ</Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowPrivateKey(key.id)}
                    >
                      <Icon name="Eye" className="mr-2" size={14} />
                      Показать приватный ключ
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Приватный ключ</DialogTitle>
                      <DialogDescription>
                        Храните приватный ключ в безопасности. Никому не передавайте его!
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Textarea
                        value={key.privateKey}
                        readOnly
                        className="font-mono text-xs h-40 resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => copyToClipboard(key.privateKey, 'Приватный ключ')}
                        >
                          <Icon name="Copy" className="mr-2" size={16} />
                          Копировать
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => downloadKey(key, true)}
                        >
                          <Icon name="Download" className="mr-2" size={16} />
                          Скачать
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                {key.lastUsed ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Clock" size={12} />
                    Использован {key.lastUsed}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">Не использовался</div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteKey(key.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {keys.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Icon name="Key" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Нет SSH ключей</h3>
            <p className="text-muted-foreground text-center mb-6">
              Создайте первый ключ для безопасного подключения к серверам
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Icon name="Plus" className="mr-2" size={20} />
                  Создать первый ключ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Генерация SSH ключа</DialogTitle>
                  <DialogDescription>
                    Создайте новую пару ключей для подключения к серверам
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName2">Название ключа</Label>
                    <Input
                      id="keyName2"
                      placeholder="Production Server"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyType2">Тип ключа</Label>
                    <Select value={newKeyType} onValueChange={(value: any) => setNewKeyType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ED25519">ED25519 (Рекомендуется)</SelectItem>
                        <SelectItem value="RSA">RSA 4096</SelectItem>
                        <SelectItem value="ECDSA">ECDSA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={generateKey} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                        Генерация...
                      </>
                    ) : (
                      <>
                        <Icon name="Key" className="mr-2" size={16} />
                        Сгенерировать
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SSHKeysManager;
