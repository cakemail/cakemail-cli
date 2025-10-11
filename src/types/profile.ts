/**
 * Profile System Types
 *
 * Defines the profile-based UX system that adapts CLI behavior
 * based on user type (developer vs marketer vs balanced)
 */

export type ProfileType = 'developer' | 'marketer' | 'balanced';

export type OutputFormat = 'json' | 'table' | 'compact';

export type ColorScheme = 'none' | 'minimal' | 'moderate' | 'rich';

export type DateFormat = 'iso8601' | 'friendly' | 'relative';

export type InteractiveMode = boolean | 'auto';

/**
 * Output configuration for profile
 */
export interface OutputConfig {
  /** Output format: json, table, or compact */
  format: OutputFormat;

  /** Color scheme: none, minimal, moderate, or rich */
  colors: ColorScheme;

  /** Pretty-print JSON output */
  pretty_print: boolean;

  /** Show tips and hints */
  show_tips: boolean;
}

/**
 * Behavior configuration for profile
 */
export interface BehaviorConfig {
  /** Enable interactive prompts for missing fields */
  interactive_prompts: InteractiveMode;

  /** Require confirmation for destructive operations */
  confirm_destructive: boolean;

  /** Auto-open browser for preview commands */
  auto_open_browser: boolean;

  /** Show progress indicators */
  show_progress: boolean;
}

/**
 * Display configuration for profile
 */
export interface DisplayConfig {
  /** Date format: iso8601, friendly, or relative */
  date_format: DateFormat;

  /** Show IDs in output */
  show_ids: boolean;

  /** Show API details in errors */
  show_api_details: boolean;

  /** Verbose error messages with technical details */
  verbose_errors: boolean;
}

/**
 * Complete profile configuration
 */
export interface ProfileConfig {
  output: OutputConfig;
  behavior: BehaviorConfig;
  display: DisplayConfig;
}

/**
 * Developer profile: JSON output, minimal interactivity, scriptable
 */
export const DEVELOPER_PROFILE: ProfileConfig = {
  output: {
    format: 'json',
    colors: 'minimal',
    pretty_print: false,
    show_tips: false,
  },
  behavior: {
    interactive_prompts: false,
    confirm_destructive: false,
    auto_open_browser: false,
    show_progress: false,
  },
  display: {
    date_format: 'iso8601',
    show_ids: true,
    show_api_details: true,
    verbose_errors: true,
  },
};

/**
 * Marketer profile: Compact output, rich interactivity, guided workflows
 */
export const MARKETER_PROFILE: ProfileConfig = {
  output: {
    format: 'compact',
    colors: 'rich',
    pretty_print: true,
    show_tips: true,
  },
  behavior: {
    interactive_prompts: true,
    confirm_destructive: true,
    auto_open_browser: true,
    show_progress: true,
  },
  display: {
    date_format: 'relative',
    show_ids: false,
    show_api_details: false,
    verbose_errors: false,
  },
};

/**
 * Balanced profile: Mix of both workflows, context-dependent
 */
export const BALANCED_PROFILE: ProfileConfig = {
  output: {
    format: 'table',
    colors: 'moderate',
    pretty_print: true,
    show_tips: true,
  },
  behavior: {
    interactive_prompts: 'auto',
    confirm_destructive: true,
    auto_open_browser: false,
    show_progress: true,
  },
  display: {
    date_format: 'friendly',
    show_ids: true,
    show_api_details: false,
    verbose_errors: false,
  },
};

/**
 * Get default profile configuration by type
 */
export function getDefaultProfile(type: ProfileType): ProfileConfig {
  switch (type) {
    case 'developer':
      return DEVELOPER_PROFILE;
    case 'marketer':
      return MARKETER_PROFILE;
    case 'balanced':
      return BALANCED_PROFILE;
    default:
      return BALANCED_PROFILE;
  }
}

/**
 * Profile descriptions for display in prompts
 */
export const PROFILE_DESCRIPTIONS = {
  developer: {
    name: '👨‍💻 Developer/Technical user',
    description: [
      'Scripting and automation',
      'JSON output and piping',
      'Minimal interactivity',
    ],
  },
  marketer: {
    name: '📊 Marketer/Business user',
    description: [
      'Campaign management',
      'Visual formatting and guides',
      'Interactive workflows',
    ],
  },
  balanced: {
    name: '🔄 Both/Balanced',
    description: [
      'Mix of technical and business tasks',
      'Flexible workflow',
    ],
  },
};
