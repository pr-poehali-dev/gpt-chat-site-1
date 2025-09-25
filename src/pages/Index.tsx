import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

function Index() {
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Привет! Я ИИ-ассистент. Выберите модель и задайте вопрос!', timestamp: '12:00' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const models = [
    { id: 'gpt-4', name: 'GPT-4', description: 'Самая мощная модель OpenAI', price: '₽2/1K токенов' },
    { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', description: 'Быстрая и экономичная', price: '₽0.3/1K токенов' },
    { id: 'claude-3', name: 'Claude-3 Opus', description: 'Творческий анализ от Anthropic', price: '₽1.5/1K токенов' },
    { id: 'gemini-pro', name: 'Gemini Pro', description: 'Продвинутая модель Google', price: '₽1/1K токенов' },
  ];

  const stats = [
    { label: 'Запросов сегодня', value: '247', change: '+12%' },
    { label: 'Токенов использовано', value: '15.2K', change: '+8%' },
    { label: 'Экономия средств', value: '₽340', change: '+15%' },
    { label: 'Время ответа', value: '1.2с', change: '-5%' },
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant',
        content: `Отвечаю с помощью модели ${models.find(m => m.id === selectedModel)?.name}. Ваш запрос обработан!`,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/img/bc049bdd-b2dc-4160-80b9-ffc73b5a9cf0.jpg" 
                alt="GPT Chat"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold gradient-text">GPT Chat</h1>
                <p className="text-sm text-muted-foreground">Все модели в одном месте</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              <Button 
                variant={activeTab === 'models' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('models')}
                className="hover-scale"
              >
                <Icon name="Brain" size={16} className="mr-2" />
                Модели
              </Button>
              <Button 
                variant={activeTab === 'chat' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('chat')}
                className="hover-scale"
              >
                <Icon name="MessageSquare" size={16} className="mr-2" />
                Чат
              </Button>
              <Button 
                variant={activeTab === 'pricing' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('pricing')}
                className="hover-scale"
              >
                <Icon name="CreditCard" size={16} className="mr-2" />
                Тарифы
              </Button>
              <Button 
                variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('analytics')}
                className="hover-scale"
              >
                <Icon name="BarChart3" size={16} className="mr-2" />
                Аналитика
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Hero Section - только на главной */}
          {activeTab === 'chat' && (
            <div className="text-center space-y-6 py-12 animate-fade-in">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  <Icon name="Sparkles" size={14} className="mr-1" />
                  Новинка: Поддержка GPT-4 Turbo
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold gradient-text">
                  Весь ИИ в одном чате
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Общайтесь с ChatGPT, Claude, Gemini и другими моделями в едином интерфейсе. 
                  Сравнивайте ответы и выбирайте лучшее решение.
                </p>
              </div>
            </div>
          )}

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-6 animate-fade-in">
            <div className="text-center space-y-4 py-8">
              <h2 className="text-3xl font-bold">Доступные модели ИИ</h2>
              <p className="text-muted-foreground">Выберите подходящую модель для ваших задач</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {models.map((model) => (
                <Card 
                  key={model.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg hover-scale ${
                    selectedModel === model.id ? 'ring-2 ring-primary border-primary' : ''
                  }`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      {selectedModel === model.id && (
                        <Icon name="Check" size={18} className="text-primary" />
                      )}
                    </div>
                    <CardDescription>{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{model.price}</Badge>
                      <Icon name="Zap" size={16} className="text-accent" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6 animate-fade-in">
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Icon name="MessageSquare" size={20} />
                        <span>Чат с ИИ</span>
                      </CardTitle>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {models.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground ml-4' 
                            : 'bg-muted mr-4'
                        }`}>
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Textarea
                        placeholder="Введите ваш вопрос..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                        className="resize-none"
                        rows={2}
                      />
                      <Button onClick={handleSendMessage} className="gradient-purple">
                        <Icon name="Send" size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Быстрые команды</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover-scale"
                      onClick={() => setInputMessage('Объясни просто:')}
                    >
                      <Icon name="Lightbulb" size={14} className="mr-2" />
                      Объясни просто
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover-scale"
                      onClick={() => setInputMessage('Переведи текст:')}
                    >
                      <Icon name="Languages" size={14} className="mr-2" />
                      Переведи
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover-scale"
                      onClick={() => setInputMessage('Исправь код:')}
                    >
                      <Icon name="Code" size={14} className="mr-2" />
                      Помоги с кодом
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6 animate-fade-in">
            <div className="text-center space-y-4 py-8">
              <h2 className="text-3xl font-bold">Выберите тариф</h2>
              <p className="text-muted-foreground">Прозрачное ценообразование без скрытых платежей</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Базовый</CardTitle>
                  <CardDescription>Для начинающих пользователей</CardDescription>
                  <div className="text-3xl font-bold">₽490 <span className="text-sm font-normal">/мес</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Icon name="Check" size={14} className="mr-2 text-accent" />
                      1000 запросов в месяц
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={14} className="mr-2 text-accent" />
                      GPT-3.5 + Claude-3
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={14} className="mr-2 text-accent" />
                      Базовая аналитика
                    </li>
                  </ul>
                  <Button className="w-full">Выбрать</Button>
                </CardContent>
              </Card>

              <Card className="border-primary relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="gradient-purple">Популярный</Badge>
                </div>
                <CardHeader>
                  <CardTitle>Профессиональный</CardTitle>
                  <CardDescription>Для активных пользователей</CardDescription>
                  <div className="text-3xl font-bold">₽990 <span className="text-sm font-normal">/мес</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Icon name="Check" size={14} className="mr-2 text-accent" />
                      5000 запросов в месяц
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={14} className="mr-2 text-accent" />
                      Все модели ИИ
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={14} className="mr-2 text-accent" />
                      Расширенная аналитика
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={14} className="mr-2 text-accent" />
                      Приоритетная поддержка
                    </li>
                  </ul>
                  <Button className="w-full gradient-purple">Выбрать</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Корпоративный</CardTitle>
                  <CardDescription>Для команд и бизнеса</CardDescription>
                  <div className="text-3xl font-bold">₽2490 <span className="text-sm font-normal">/мес</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Icon name="Check" size={14} className="mr-2 text-accent" />
                      Безлимитные запросы
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={14} className="mr-2 text-accent" />
                      Все модели + API
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={14} className="mr-2 text-accent" />
                      Полная аналитика
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={14} className="mr-2 text-accent" />
                      Персональный менеджер
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline">Связаться</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <div className="text-center space-y-4 py-8">
              <h2 className="text-3xl font-bold">Аналитика использования</h2>
              <p className="text-muted-foreground">Отслеживайте ваши запросы и оптимизируйте расходы</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="hover-scale">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{stat.value}</span>
                        <Badge variant={stat.change.startsWith('+') ? 'default' : 'secondary'}>
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="TrendingUp" size={20} />
                    <span>Использование по моделям</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>GPT-4</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Claude-3</span>
                      <span>30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>GPT-3.5</span>
                      <span>15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Gemini Pro</span>
                      <span>10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Clock" size={20} />
                    <span>Активность по часам</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['09:00', '12:00', '15:00', '18:00', '21:00'].map((time, index) => (
                      <div key={time} className="flex items-center space-x-3">
                        <span className="text-sm w-12">{time}</span>
                        <Progress 
                          value={[85, 95, 70, 60, 40][index]} 
                          className="flex-1 h-2" 
                        />
                        <span className="text-sm text-muted-foreground">{[85, 95, 70, 60, 40][index]}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="grid grid-cols-4 gap-1 p-2">
          {[
            { id: 'models', icon: 'Brain', label: 'Модели' },
            { id: 'chat', icon: 'MessageSquare', label: 'Чат' },
            { id: 'pricing', icon: 'CreditCard', label: 'Тарифы' },
            { id: 'analytics', icon: 'BarChart3', label: 'Статистика' },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col p-2 h-auto"
            >
              <Icon name={tab.icon as any} size={16} />
              <span className="text-xs mt-1">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Index;