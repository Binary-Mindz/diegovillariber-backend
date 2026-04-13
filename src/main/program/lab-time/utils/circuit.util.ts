import { BadRequestException } from '@nestjs/common';
import { CIRCUITS_DATA, CircuitData, CircuitLayoutData } from '../data/circuits.data';

export function normalizeText(value?: string | null): string {
  return (value ?? '').trim().toLowerCase();
}

export function findCircuitByTrackName(trackName: string): CircuitData | undefined {
  return CIRCUITS_DATA.find(
    (item) => normalizeText(item.trackName) === normalizeText(trackName),
  );
}

export function findCircuitLayout(
  trackName: string,
  trackLayout?: string | null,
): CircuitLayoutData | null {
  const circuit = findCircuitByTrackName(trackName);
  if (!circuit) return null;

  if (!trackLayout) {
    return circuit.layouts[0] ?? null;
  }

  return (
    circuit.layouts.find(
      (item) => normalizeText(item.trackLayout) === normalizeText(trackLayout),
    ) ?? null
  );
}

export function validateCircuitSelection(
  trackName: string,
  trackLayout?: string | null,
): CircuitLayoutData | null {
  const circuit = findCircuitByTrackName(trackName);

  if (!circuit) {
    throw new BadRequestException('Invalid trackName selected');
  }

  if (!trackLayout) {
    return circuit.layouts[0] ?? null;
  }

  const layout = findCircuitLayout(trackName, trackLayout);
  if (!layout) {
    throw new BadRequestException('Invalid trackLayout for selected track');
  }

  return layout;
}