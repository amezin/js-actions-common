import { defineConfig, globalIgnores } from 'eslint/config';
import shared from '@amezin/eslint-config-js-actions';

export default defineConfig([
    globalIgnores(['packages/']), // this line is not necessary in action repositories
    shared,
]);
