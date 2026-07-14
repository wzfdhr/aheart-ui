import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Clock,
  Info,
  LoaderCircle,
  Plus,
  Search,
  Settings,
  User,
  X
} from '@lucide/vue'
import type { Component } from 'vue'

export const iconComponents: Record<string, Component> = {
  search: Search,
  setting: Settings,
  settings: Settings,
  loading: LoaderCircle,
  info: Info,
  user: User,
  plus: Plus,
  check: Check,
  close: X,
  arrow: ArrowRight,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  copy: Copy,
  clock: Clock
}

export const warnedUnknownIconNames = new Set<string>()
