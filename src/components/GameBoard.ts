import { colors } from 'quasar';
import {
  Color,
  Coord,
  Move,
  isInBoard,
  opposite,
  unpackCoord,
} from 'src/services/game-types';
import { MultiPVInfo, PVInfo } from 'src/services/engine-types';

export const DefaultBoardStyle = {
  boardColor: '#F4D03F',
  lineColor: '#000000',
  lineWidth: 0.03,
  starRadiusScale: 0.1,
  passMarkColor: '#0000000A',
  coordColor: '#000000',
  coordScale: 0.6,
  coordFontStyle: '',
  coordFontFamily: 'sans-serif',
  pieceColor: ['#000000', '#FFFFFF'],
  pieceScale: 0.95,
  pieceStrokeWidth: 0.021,
  pieceStrokeColor: ['#000000', '#000000'],
  winlineWidth: 0.12,
  winlineColor: '#2E86C1',
  indexColor: ['#FFFFFF', '#000000'],
  indexScale: 0.45,
  indexFontStyle: 'bold',
  indexFontFamily: 'sans-serif',
  lastStepColor: '#E74C3C',
  lastStepScale: 0.28,
  nextMoveColor: '#00000040',
  nextMoveScale: 0.2,
  forbidStrokeColor: '#E74C3C',
  forbidStrokeWidth: 0.12,
  forbidCrossSize: 0.22,
  selectionStrokeColor: '#E74C3C',
  selectionStrokeWidth: 0.08,
  depthAlphaTemp: 2.0,
  minWinrateHue: 48,
  maxWinrateHue: 180,
  infoBackgroundSaturation: 90,
  infoBackgroundValue: 90,
  infoDynamicTextAlpha: false,
  infoMainColor: '#000000',
  infoMainScale: 0.45,
  infoMainAlpha: 1.0,
  infoMainFontStyle: 600,
  infoMainFontFamily: 'sans-serif',
  infoSubColor: '#000000',
  infoSubScale: 0.3,
  infoSubAlpha: 0.9,
  infoSubFontStyle: 400,
  infoSubFontFamily: 'sans-serif',
  realtimeColor: {
    searching: '#3FF476',
    searched: '#3C5EE7',
    lost: '#FDFEFE',
    best: '#E74C3C',
  },
  realtimeScale: 0.09,
  realtimeBestScale: 0.12,
};

export type BoardStyle = typeof DefaultBoardStyle;

export type DisplayType = 'none' | 'eval' | 'winrate' | 'depth' | 'nodes';

export interface BoardSettings {
  boardStyle: BoardStyle;
  clickBehavior: 'direct' | 'second' | 'slide';
  showCoord: boolean;
  showIndex: boolean;
  showForbid: boolean;
  showWinline: boolean;
  showNextMove: boolean;
  highlightLastStep: boolean;
  showRealtimeStatus: boolean;
  pvMainDisplayType: DisplayType;
  pvSubDisplayType: DisplayType;
  previewOpacity: number;
  previewOpacityDecay: number;
}

export interface BoardProps {
  boardSize: number;
  settings: BoardSettings;
  history: Array<Move>;
  nextMove?: Move;
  winline?: [Coord, Coord];
  forbids?: Array<Coord>;
  multiPVInfo?: MultiPVInfo;
  previewPV?: Array<Coord>;
  startIndex?: number;
  thinking?: boolean;
  noCoordSelection?: boolean;
}

export type Context2D =
  | CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D;

export type CanvasConfig = {
  width: number;
  height: number;
  padding: number;
  paddingUp: number;
  boardPixels: number;
  renderRatio: number;
  isImageExport: boolean;
};

function fillCircle(ctx: Context2D, x: number, y: number, r: number) {
  const PI2 = 2 * Math.PI;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, PI2);
  ctx.fill();
}

function drawBackground(ctx: Context2D, cfg: CanvasConfig, style: BoardStyle) {
  ctx.save();
  if (!cfg.isImageExport) {
    ctx.shadowOffsetX = ctx.shadowOffsetY = 2;
    ctx.shadowBlur = cfg.padding / 2;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  }
  ctx.fillStyle = style.boardColor;
  ctx.fillRect(0, 0, cfg.boardPixels, cfg.boardPixels);
  ctx.restore();
}

function drawBoard(ctx: Context2D, style: BoardStyle, s: number, cs: number) {
  ctx.save();
  ctx.strokeStyle = ctx.fillStyle = style.lineColor;
  ctx.translate(cs / 2, cs / 2);
  ctx.scale(cs, cs);
  const si = s - 1;

  // Draw grid lines
  ctx.lineWidth = style.lineWidth;
  ctx.beginPath();
  for (let i = 1; i < si; i++) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, si);
    ctx.moveTo(0, i);
    ctx.lineTo(si, i);
  }
  ctx.stroke();

  // Draw grid border
  ctx.lineWidth = style.lineWidth * 2.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(si, 0);
  ctx.lineTo(si, si);
  ctx.lineTo(0, si);
  ctx.closePath();
  ctx.stroke();

  // Draw star points
  const starPad = Math.floor(s / 5);
  const starCenter = Math.floor(s / 2);
  const starRadius = style.starRadiusScale;
  fillCircle(ctx, starPad, starPad, starRadius);
  fillCircle(ctx, si - starPad, starPad, starRadius);
  fillCircle(ctx, starPad, si - starPad, starRadius);
  fillCircle(ctx, si - starPad, si - starPad, starRadius);
  fillCircle(ctx, starCenter, starCenter, starRadius);

  // Draw pass mark
  ctx.fillStyle = style.passMarkColor;
  fillCircle(ctx, s, s, 0.5);

  ctx.restore();
}

function drawCoordinates(
  ctx: Context2D,
  cfg: CanvasConfig,
  style: BoardStyle,
  s: number,
  cs: number
) {
  ctx.save();
  const coordPixels = Math.min(cs * style.coordScale, 20);
  ctx.font = `${style.coordFontStyle} ${coordPixels}px ${style.coordFontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = style.coordColor;

  // Left coordinates
  ctx.save();
  ctx.translate(-cfg.padding / 2, cs / 2);
  for (let i = 0; i < s; i++) ctx.fillText(`${s - i}`, 0, cs * i, cfg.padding);

  // Right coordinates
  ctx.translate(cfg.boardPixels + cfg.padding, 0);
  for (let i = 0; i < s; i++) ctx.fillText(`${s - i}`, 0, cs * i, cfg.padding);
  ctx.restore();

  // Bottom coordinates
  ctx.translate(cs / 2, cfg.boardPixels + cfg.padding / 2);
  const baseCharCode = 'A'.charCodeAt(0);
  for (let i = 0; i < s; i++)
    ctx.fillText(String.fromCharCode(baseCharCode + i), cs * i, 0, cs);

  ctx.restore();
}

function drawPieces(
  ctx: Context2D,
  style: BoardStyle,
  s: number,
  cs: number,
  pieces: Array<[Coord, Color, number]>,
  passInfo: [Color, number] | null,
  opacity = 1.0,
  opacityDecay = 1.0
) {
  ctx.save();
  ctx.translate(cs / 2, cs / 2);
  ctx.scale(cs, cs);
  const radius = style.pieceScale / 2;
  const si = s - 1;

  ctx.globalAlpha = opacity;
  ctx.lineWidth = style.pieceStrokeWidth;
  for (const [coord, color] of pieces) {
    ctx.fillStyle = style.pieceColor[color];
    ctx.strokeStyle = style.pieceStrokeColor[color];
    const [x, y] = unpackCoord(coord);
    fillCircle(ctx, x, si - y, radius);
    if (style.pieceStrokeWidth > 0) ctx.stroke();
    ctx.globalAlpha *= opacityDecay;
  }

  if (passInfo) {
    const color = passInfo[0];
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = style.pieceColor[color];
    ctx.strokeStyle = style.pieceStrokeColor[color];
    fillCircle(ctx, s, s, radius);
    if (style.pieceStrokeWidth > 0) ctx.stroke();
  }

  ctx.restore();
}

function drawWinline(
  ctx: Context2D,
  style: BoardStyle,
  s: number,
  cs: number,
  winline: [Coord, Coord]
) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.strokeStyle = style.winlineColor;
  ctx.lineWidth = style.winlineWidth;
  ctx.translate(cs / 2, cs / 2);
  ctx.scale(cs, cs);

  const si = s - 1;
  const [start, end] = winline;
  const [x1, y1] = unpackCoord(start);
  const [x2, y2] = unpackCoord(end);
  ctx.beginPath();
  ctx.moveTo(x1, si - y1);
  ctx.lineTo(x2, si - y2);
  ctx.stroke();

  ctx.restore();
}

function drawIndex(
  ctx: Context2D,
  style: BoardStyle,
  s: number,
  cs: number,
  pieces: Array<[Coord, Color, number]>,
  passInfo: [Color, number] | null,
  startIndex: number,
  lastIndex: number,
  highlightLastStep: boolean
) {
  ctx.save();
  const indexPixels = Math.min(cs * style.indexScale, 20);
  ctx.font = `${style.indexFontStyle} ${indexPixels}px ${style.indexFontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.translate(cs / 2, cs / 2);
  const si = s - 1;

  for (let i = startIndex; i < pieces.length; i++) {
    const [coord, color, index] = pieces[i];
    const [x, y] = unpackCoord(coord);
    if (highlightLastStep && index === lastIndex)
      ctx.fillStyle = style.lastStepColor;
    else ctx.fillStyle = style.indexColor[color];
    ctx.fillText(`${index}`, cs * x, cs * (si - y), cs);
  }

  if (passInfo) {
    const [color, index] = passInfo;
    if (highlightLastStep && index === lastIndex)
      ctx.fillStyle = style.lastStepColor;
    else ctx.fillStyle = style.indexColor[color];
    ctx.fillText(`${index}`, cs * s, cs * s, cs);
  }

  ctx.restore();
}

function drawLastStep(
  ctx: Context2D,
  style: BoardStyle,
  s: number,
  cs: number,
  lastMove: Move
) {
  ctx.save();
  ctx.translate(cs / 2, cs / 2);
  ctx.scale(cs, cs);
  const si = s - 1;
  const [x, y] = lastMove == 'pass' ? [s, -1] : unpackCoord(lastMove);

  ctx.fillStyle = style.lastStepColor;
  const r = style.lastStepScale;
  ctx.beginPath();
  ctx.moveTo(x, si - y - r);
  ctx.lineTo(x - (r * Math.sqrt(3)) / 2, si - y + r / 2);
  ctx.lineTo(x + (r * Math.sqrt(3)) / 2, si - y + r / 2);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawNextMove(
  ctx: Context2D,
  style: BoardStyle,
  s: number,
  cs: number,
  nextMove: Move
) {
  ctx.save();
  ctx.translate(cs / 2, cs / 2);
  ctx.scale(cs, cs);
  const si = s - 1;
  const [x, y] = nextMove == 'pass' ? [s, -1] : unpackCoord(nextMove);

  ctx.fillStyle = style.nextMoveColor;
  fillCircle(ctx, x, si - y, style.nextMoveScale);

  ctx.restore();
}

function drawForbids(
  ctx: Context2D,
  style: BoardStyle,
  s: number,
  cs: number,
  forbids: Array<Coord>
) {
  ctx.save();
  ctx.strokeStyle = style.forbidStrokeColor;
  ctx.lineWidth = style.forbidStrokeWidth;
  ctx.lineCap = 'round';
  ctx.translate(cs / 2, cs / 2);
  ctx.scale(cs, cs);
  const si = s - 1;

  const crossSize = style.forbidCrossSize;
  for (const coord of forbids) {
    const [x, y] = unpackCoord(coord);
    ctx.beginPath();
    ctx.moveTo(x - crossSize, si - y - crossSize);
    ctx.lineTo(x + crossSize, si - y + crossSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + crossSize, si - y - crossSize);
    ctx.lineTo(x - crossSize, si - y + crossSize);
    ctx.stroke();
  }

  ctx.restore();
}

function drawSelection(
  ctx: Context2D,
  style: BoardStyle,
  s: number,
  cs: number,
  move: Move
) {
  ctx.save();
  ctx.strokeStyle = style.selectionStrokeColor;
  ctx.lineWidth = style.selectionStrokeWidth;
  ctx.translate(cs / 2, cs / 2);
  ctx.scale(cs, cs);
  const si = s - 1;

  const [x, y] = move == 'pass' ? [s, -1] : unpackCoord(move as Coord);
  ctx.beginPath();
  ctx.moveTo(x - 0.5, si - y - 0.5);
  ctx.lineTo(x + 0.5, si - y - 0.5);
  ctx.lineTo(x + 0.5, si - y + 0.5);
  ctx.lineTo(x - 0.5, si - y + 0.5);
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}

function formatInfo(pvInfo: PVInfo, displayType: DisplayType) {
  switch (displayType) {
    case 'eval':
      return pvInfo.eval;
    case 'winrate':
      return pvInfo.winrate.toFixed(1);
    case 'depth':
      return pvInfo.depth.toString();
    case 'nodes':
      return pvInfo.nodes >= 1000000
        ? pvInfo.nodes >= 10000000
          ? `${Math.floor(pvInfo.nodes / 1000000)}M`
          : `${(pvInfo.nodes / 1000000).toFixed(1)}M`
        : pvInfo.nodes >= 1000
        ? pvInfo.nodes >= 10000
          ? `${Math.floor(pvInfo.nodes / 1000)}K`
          : `${(pvInfo.nodes / 1000).toFixed(1)}K`
        : pvInfo.nodes.toString();
    default:
      return null;
  }
}

function winrateToColor(wr: number, style: BoardStyle): string {
  return colors.rgbToHex(
    colors.hsvToRgb({
      h: style.minWinrateHue + wr * style.maxWinrateHue,
      s: style.infoBackgroundSaturation,
      v: style.infoBackgroundValue,
    })
  );
}

function drawMultiPVInfo(
  ctx: Context2D,
  style: BoardStyle,
  s: number,
  cs: number,
  multiPVInfo: MultiPVInfo,
  showDetail: boolean,
  pvMainDisplayType: DisplayType,
  pvSubDisplayType: DisplayType
) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.translate(cs / 2, cs / 2);
  ctx.scale(cs, cs);
  const si = s - 1;
  const bgRadius = style.pieceScale / 2;
  const mainInfoYOffset = pvSubDisplayType === 'none' ? 0 : -0.25;
  const subInfoYOffset = 0.25;
  const mainInfoFont = `${style.infoMainFontStyle} ${
    cs * style.infoMainScale
  }px ${style.infoMainFontFamily}`;
  const subInfoFont = `${style.infoSubFontStyle} ${cs * style.infoSubScale}px ${
    style.infoSubFontFamily
  }`;

  const infoValues = Array.from(multiPVInfo.values());
  const maxDepth = Math.max(...infoValues.map((info) => info.depth));
  const maxNodes = Math.max(...infoValues.map((info) => info.nodes));

  for (const [move, info] of multiPVInfo) {
    if (move == 'pass') continue;
    const [x, y] = unpackCoord(move);
    const mainInfoString = formatInfo(info, pvMainDisplayType);

    if (mainInfoString) {
      const baseAlpha = maxDepth
        ? Math.exp((info.depth - maxDepth) / style.depthAlphaTemp)
        : info.nodes / maxNodes;

      // Draw circle background
      ctx.globalAlpha = baseAlpha;
      ctx.fillStyle = winrateToColor(info.winrate, style);
      fillCircle(ctx, x, si - y, bgRadius);

      // Draw main info
      ctx.globalAlpha =
        style.infoMainAlpha * (style.infoDynamicTextAlpha ? baseAlpha : 1);
      ctx.fillStyle = style.infoMainColor;
      ctx.font = mainInfoFont;
      ctx.fillText(mainInfoString, x, si - y + mainInfoYOffset, cs);

      // Draw sub info
      const subInfoString = formatInfo(info, pvSubDisplayType);
      if (subInfoString) {
        ctx.globalAlpha =
          style.infoSubAlpha * (style.infoDynamicTextAlpha ? baseAlpha : 1);
        ctx.fillStyle = style.infoSubColor;
        ctx.font = subInfoFont;
        ctx.fillText(subInfoString, x, si - y + subInfoYOffset, cs);
      }
    } else if (showDetail && info.status) {
      // Draw realtime status
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = style.realtimeColor[info.status];
      const radius =
        info.status == 'best' ? style.realtimeBestScale : style.realtimeScale;
      fillCircle(ctx, x, si - y, radius);
    }
  }
}

export function drawBoardLayer(
  ctx: Context2D,
  cfg: CanvasConfig,
  props: BoardProps
) {
  const boardPixels = cfg.width - 2 * cfg.padding;
  const cellSize = boardPixels / props.boardSize;

  ctx.save();
  ctx.scale(cfg.renderRatio, cfg.renderRatio);
  if (!cfg.isImageExport) ctx.clearRect(0, 0, cfg.width, cfg.height);
  ctx.translate(cfg.padding, cfg.paddingUp);

  drawBackground(ctx, cfg, props.settings.boardStyle);
  drawBoard(ctx, props.settings.boardStyle, props.boardSize, cellSize);
  if (props.settings.showCoord)
    drawCoordinates(
      ctx,
      cfg,
      props.settings.boardStyle,
      props.boardSize,
      cellSize
    );

  ctx.restore();
}

export function drawPieceLayer(
  ctx: Context2D,
  cfg: CanvasConfig,
  props: BoardProps,
  endIndex = Infinity
) {
  const boardPixels = cfg.width - 2 * cfg.padding;
  const cellSize = boardPixels / props.boardSize;
  endIndex = Math.min(props.history.length, endIndex);

  ctx.save();
  ctx.scale(cfg.renderRatio, cfg.renderRatio);
  if (!cfg.isImageExport) ctx.clearRect(0, 0, cfg.width, cfg.height);
  ctx.translate(cfg.padding, cfg.paddingUp);

  const pieces = Array<[Coord, Color, number]>();
  let passInfo: [Color, number] | null = null;
  let currentColor = Color.Black;
  for (let i = 0; i < props.history.length; i++) {
    if (i < endIndex) {
      if (props.history[i] != 'pass')
        pieces.push([props.history[i] as Coord, currentColor, i + 1]);
      else passInfo = [currentColor, i + 1];
    }
    currentColor = opposite(currentColor);
  }

  drawPieces(
    ctx,
    props.settings.boardStyle,
    props.boardSize,
    cellSize,
    pieces,
    passInfo
  );
  if (props.previewPV) {
    const previewPieces = Array<[Coord, Color, number]>();
    for (let i = 0; i < props.previewPV.length; i++) {
      previewPieces.push([
        props.history[i] as Coord,
        currentColor,
        props.history.length + i + 1,
      ]);
      currentColor = opposite(currentColor);
    }
    drawPieces(
      ctx,
      props.settings.boardStyle,
      props.boardSize,
      cellSize,
      previewPieces,
      passInfo,
      props.settings.previewOpacity,
      props.settings.previewOpacityDecay
    );
    drawIndex(
      ctx,
      props.settings.boardStyle,
      props.boardSize,
      cellSize,
      pieces.concat(previewPieces),
      passInfo,
      pieces.length,
      props.history.length + props.previewPV.length - 1,
      false
    );
  } else {
    if (
      props.settings.showWinline &&
      props.winline &&
      endIndex >= props.history.length
    )
      drawWinline(
        ctx,
        props.settings.boardStyle,
        props.boardSize,
        cellSize,
        props.winline
      );
    if (props.settings.showIndex)
      drawIndex(
        ctx,
        props.settings.boardStyle,
        props.boardSize,
        cellSize,
        pieces,
        passInfo,
        props.startIndex || 0,
        endIndex,
        props.settings.highlightLastStep
      );
    else if (props.settings.highlightLastStep && props.history.length > 0)
      drawLastStep(
        ctx,
        props.settings.boardStyle,
        props.boardSize,
        cellSize,
        props.history[endIndex - 1]
      );
    if (props.settings.showNextMove && props.nextMove)
      drawNextMove(
        ctx,
        props.settings.boardStyle,
        props.boardSize,
        cellSize,
        props.nextMove
      );
  }

  ctx.restore();
}

export function drawInfoLayer(
  ctx: Context2D,
  cfg: CanvasConfig,
  props: BoardProps,
  selectedCoord: Move | null
) {
  if (props.previewPV) return;

  const boardPixels = cfg.width - 2 * cfg.padding;
  const cellSize = boardPixels / props.boardSize;

  ctx.save();
  ctx.scale(cfg.renderRatio, cfg.renderRatio);
  if (!cfg.isImageExport) ctx.clearRect(0, 0, cfg.width, cfg.height);
  ctx.translate(cfg.padding, cfg.paddingUp);

  if (!props.thinking && props.settings.showForbid && props.forbids)
    drawForbids(
      ctx,
      props.settings.boardStyle,
      props.boardSize,
      cellSize,
      props.forbids
    );

  if (props.thinking && props.multiPVInfo)
    drawMultiPVInfo(
      ctx,
      props.settings.boardStyle,
      props.boardSize,
      cellSize,
      props.multiPVInfo,
      props.settings.showRealtimeStatus,
      props.settings.pvMainDisplayType,
      props.settings.pvSubDisplayType
    );

  if (
    !props.thinking &&
    selectedCoord !== null &&
    (selectedCoord == 'pass' || isInBoard(selectedCoord, props.boardSize))
  )
    drawSelection(
      ctx,
      props.settings.boardStyle,
      props.boardSize,
      cellSize,
      selectedCoord
    );

  ctx.restore();
}

export function exportJPG(
  props: BoardProps,
  title: string | null,
  scaleRatio = 3
) {
  const canvasConfig = {
    width: 420,
    height: 420 - (title ? 0 : 16),
    padding: 26,
    paddingUp: title ? 26 : 10,
    boardPixels: 420 - 2 * 26,
    renderRatio: scaleRatio,
    isImageExport: true,
  } as CanvasConfig;

  const canvasImage = document.createElement('canvas');
  canvasImage.width = canvasConfig.width * canvasConfig.renderRatio;
  canvasImage.height = canvasConfig.height * canvasConfig.renderRatio;
  const ctx = canvasImage.getContext('2d');
  if (!ctx) return;

  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.scale(canvasConfig.renderRatio, canvasConfig.renderRatio);
  ctx.fillRect(0, 0, canvasConfig.width, canvasConfig.height);
  if (title) {
    const style = props.settings.boardStyle;
    const boardPixels = canvasConfig.width - 2 * canvasConfig.padding;
    const cellSize = boardPixels / props.boardSize;
    const textPixels = Math.min(cellSize * style.coordScale, 20);
    ctx.font = `${style.coordFontStyle} ${textPixels}px ${style.coordFontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = style.coordColor;
    ctx.fillText(title, canvasConfig.width / 2, canvasConfig.paddingUp / 2 + 2);
  }
  ctx.restore();

  drawBoardLayer(ctx, canvasConfig, props);
  drawPieceLayer(ctx, canvasConfig, props);
  drawInfoLayer(ctx, canvasConfig, props, null);
  return new Promise((resolve) => {
    canvasImage.toBlob((blob) => resolve(blob), 'image/jpeg', 1.0);
    canvasImage.remove();
  });
}

export function exportGIF(
  props: BoardProps,
  title: string | null,
  startIndex: number,
  delayms: number,
  delaymsFinal: number,
  scaleRatio = 2
) {
  const canvasConfig = {
    width: 420,
    height: 420 - (title ? 0 : 16),
    padding: 26,
    paddingUp: title ? 26 : 10,
    boardPixels: 420 - 2 * 26,
    renderRatio: scaleRatio,
    isImageExport: true,
  } as CanvasConfig;

  const canvasImage = document.createElement('canvas');
  canvasImage.width = canvasConfig.width * canvasConfig.renderRatio;
  canvasImage.height = canvasConfig.height * canvasConfig.renderRatio;
  const ctx = canvasImage.getContext('2d');
  if (!ctx) return;
  startIndex = Math.max(1, startIndex);

  // eslint-disable-next-line
  // @ts-ignore
  const gif = new GIF({
    workers: 4,
    quality: 1,
    width: canvasImage.width,
    height: canvasImage.height,
    workerScript: 'lib/gif.worker.js',
  });

  for (
    let endIndex = startIndex;
    endIndex <= props.history.length;
    endIndex++
  ) {
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.scale(canvasConfig.renderRatio, canvasConfig.renderRatio);
    ctx.fillRect(0, 0, canvasConfig.width, canvasConfig.height);
    if (title) {
      const style = props.settings.boardStyle;
      const boardPixels = canvasConfig.width - 2 * canvasConfig.padding;
      const cellSize = boardPixels / props.boardSize;
      const textPixels = Math.min(cellSize * style.coordScale, 20);
      ctx.font = `${style.coordFontStyle} ${textPixels}px ${style.coordFontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = style.coordColor;
      ctx.fillText(
        title,
        canvasConfig.width / 2,
        canvasConfig.paddingUp / 2 + 2
      );
    }
    ctx.restore();

    drawBoardLayer(ctx, canvasConfig, props);
    drawPieceLayer(ctx, canvasConfig, props, endIndex);

    gif.addFrame(ctx, {
      copy: true,
      delay: endIndex == props.history.length ? delaymsFinal : delayms,
    });
  }

  return new Promise((resolve) => {
    gif.on('finished', (blob: Blob) => resolve(blob));
    gif.render();
  });
}
