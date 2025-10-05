import './images/avatar.jpg';
import './images/logo.svg';
import './pages/index.css';

import { initPlaceCardsWorkflow, initialCards } from './components/cards.js';
import { initProfileWorkflow } from './components/profile.js';

initProfileWorkflow();
initPlaceCardsWorkflow(initialCards);
