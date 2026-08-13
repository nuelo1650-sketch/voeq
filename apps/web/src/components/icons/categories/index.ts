import type { ComponentType } from 'react';
import { FoodIcon } from './FoodIcon';
import { FashionIcon } from './FashionIcon';
import { TechIcon } from './TechIcon';
import { BeautyIcon } from './BeautyIcon';
import { RepairsIcon } from './RepairsIcon';
import { PrintingIcon } from './PrintingIcon';
import { LaundryIcon } from './LaundryIcon';
import { PhotographyIcon } from './PhotographyIcon';
import { AcademicIcon } from './AcademicIcon';
import { LogisticsIcon } from './LogisticsIcon';
import { FurnitureIcon } from './FurnitureIcon';
import { HealthIcon } from './HealthIcon';
import { CateringIcon } from './CateringIcon';
import { CleaningIcon } from './CleaningIcon';
import { ElectricalIcon } from './ElectricalIcon';
import { PlumbingIcon } from './PlumbingIcon';
import { TailoringIcon } from './TailoringIcon';
import { SupermarketIcon } from './SupermarketIcon';
import { PharmacyIcon } from './PharmacyIcon';
import { OtherIcon } from './OtherIcon';
import type { IconProps } from '../icon-types';

export type { IconProps };
export {
  FoodIcon,
  FashionIcon,
  TechIcon,
  BeautyIcon,
  RepairsIcon,
  PrintingIcon,
  LaundryIcon,
  PhotographyIcon,
  AcademicIcon,
  LogisticsIcon,
  FurnitureIcon,
  HealthIcon,
  CateringIcon,
  CleaningIcon,
  ElectricalIcon,
  PlumbingIcon,
  TailoringIcon,
  SupermarketIcon,
  PharmacyIcon,
  OtherIcon,
};

type IconComponent = ComponentType<{ className?: string }>;

/**
 * All category icon keys resolve here. The seed stores lucide-style names
 * (e.g. "utensils", "shirt"); we also keep the semantic names so any caller
 * works. Unknown names fall back to OtherIcon via CategoryPill.
 */
export const Icons: Record<string, IconComponent> = {
  // Semantic keys
  FoodIcon,
  FashionIcon,
  TechIcon,
  BeautyIcon,
  RepairsIcon,
  PrintingIcon,
  LaundryIcon,
  PhotographyIcon,
  AcademicIcon,
  LogisticsIcon,
  FurnitureIcon,
  HealthIcon,
  CateringIcon,
  CleaningIcon,
  ElectricalIcon,
  PlumbingIcon,
  TailoringIcon,
  SupermarketIcon,
  PharmacyIcon,
  OtherIcon,

  // Lucide-style keys used by the seed
  utensils: FoodIcon,
  cookie: FoodIcon,
  'cup-soda': FoodIcon,
  croissant: FoodIcon,
  shirt: FashionIcon,
  gem: FashionIcon,
  footprints: FashionIcon,
  bag: FashionIcon,
  scissors: TailoringIcon,
  cpu: TechIcon,
  smartphone: TechIcon,
  laptop: TechIcon,
  sparkles: BeautyIcon,
  hand: BeautyIcon,
  printer: PrintingIcon,
  camera: PhotographyIcon,
  video: PhotographyIcon,
  megaphone: PhotographyIcon,
  book: AcademicIcon,
  'graduation-cap': AcademicIcon,
  pencil: AcademicIcon,
  type: AcademicIcon,
  'file-text': AcademicIcon,
  wrench: RepairsIcon,
  truck: LogisticsIcon,
  running: LogisticsIcon,
  heart: HealthIcon,
  dumbbell: HealthIcon,
  pill: PharmacyIcon,
  droplet: PlumbingIcon,
  sofa: FurnitureIcon,
  'shopping-cart': SupermarketIcon,
  grid: OtherIcon,
  'spray-can': CleaningIcon,
};

export type { IconComponent };
