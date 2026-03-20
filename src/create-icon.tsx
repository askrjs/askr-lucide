import { IconBase } from '@askrjs/askr-ui/icon';
import type { IconNode, IconProps } from './types';

export function createIcon(displayName: string, iconNode: IconNode) {
  function Icon({ ...rest }: IconProps) {
    return (
      <IconBase {...rest} iconName={displayName}>
        {iconNode.map(([tag, attrs], i) => {
          const Tag = tag as string;
          return <Tag key={i} {...(attrs as Record<string, unknown>)} />;
        })}
      </IconBase>
    );
  }

  Icon.displayName = displayName;
  return Icon;
}
