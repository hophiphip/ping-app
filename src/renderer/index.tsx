import { createRoot } from 'react-dom/client';
import App from './App';
import initTranslations from './i18n/index';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

initTranslations();
