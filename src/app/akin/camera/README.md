# Custom Camera Component - Funcionalidades de Captura Automática

## Funcionalidades Implementadas

O componente `CustomCamera` agora inclui todas as funcionalidades de captura cronometrada e quantidade configurável que estavam presentes no componente `CameraCapture`.

### Novas Props

- `getCapturedImages?: (value: CapturedImage[]) => void` - Callback para receber múltiplas imagens capturadas
- `enableAutoCapture?: boolean` - Habilitar captura automática (padrão: false)
- `captureCount?: number` - Número de capturas automáticas (padrão: 5)
- `intervalSeconds?: number` - Intervalo entre capturas em segundos (padrão: 3)

### Novos Métodos (ref)

- `startAutoCapture()` - Inicia a captura automática cronometrada
- `stopAutoCapture()` - Para a captura automática

### Funcionalidades Visuais

1. **Countdown Overlay**: Durante a captura automática, mostra um countdown visual antes de cada captura
2. **Status Indicator**: Mostra o progresso da captura (captura atual/total) durante o processo
3. **Lista de Imagens**: Armazena e exibe todas as imagens capturadas com timestamp
4. **Download Individual/Múltiplo**: Permite baixar imagens individualmente ou todas de uma vez

### Interface CapturedImage

```typescript
interface CapturedImage {
  id: string;
  dataUrl: string;
  timestamp: Date;
}
```

### Exemplo de Uso

```tsx
function Example() {
  const cameraRef = useRef();
  const [capturedImages, setCapturedImages] = useState([]);
  const [captureCount, setCaptureCount] = useState(5);
  const [intervalSeconds, setIntervalSeconds] = useState(3);

  const handleStartAutoCapture = () => {
    cameraRef.current?.startAutoCapture();
  };

  return (
    <CustomCamera
      ref={cameraRef}
      captureCount={captureCount}
      intervalSeconds={intervalSeconds}
      getCapturedImages={setCapturedImages}
      className="space-y-4"
      videoClassName="aspect-video"
    />
  );
}
```

### Estados de Captura

- **Idle**: Câmera ativa, aguardando comando
- **Countdown**: Mostra contagem regressiva antes da captura
- **Capturing**: Capturando imagem (indicador visual)
- **Completed**: Processo finalizado, imagens disponíveis

### Controles

1. **Captura Individual**: Botão para capturar uma foto instantaneamente
2. **Captura Automática**: Inicia sequência cronometrada de capturas
3. **Parar Captura**: Interrompe o processo de captura automática
4. **Configurações**: Número de capturas e intervalo personalizáveis
5. **Gerenciamento**: Download e limpeza das imagens capturadas
