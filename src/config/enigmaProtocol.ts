import type { PuzzleContent } from './event';

export const enigmaProtocol: PuzzleContent = {
  ciphertext: 'OPZFQWVSLOM',
  protocolTitle: '暗号解読プロトコル',
  instructions: '暗号文を標準的な Enigma I（M3）シミュレーターに入力し、以下の設定で復号してください。復号された英語のフレーズを入力欄に入力してください。',
  settings: [
    { label: '機種', value: 'Enigma I（M3）' },
    { label: 'ローターの順序（左から右）', value: 'I → II → III' },
    { label: 'リング設定', value: 'A – A – A' },
    { label: '開始位置', value: 'A – A – A' },
    { label: 'リフレクター', value: 'B' },
    { label: 'プラグボード', value: '接続なし（ペアなし）' },
    { label: '暗号文', value: 'OPZFQWVSLOM' },
  ],
};
