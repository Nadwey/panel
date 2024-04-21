import { describe, expect, it } from 'vitest';

import { bytesToString, ip, mbToBytes } from '@/lib/formatters';

describe('@/lib/formatters.ts', () => {
    describe('mbToBytes()', () => {
        it('should convert from MB to Bytes', () => {
            expect(mbToBytes(1)).equals(1_048_576);
            expect(mbToBytes(0)).equals(0);
            expect(mbToBytes(0.1)).equals(104_857);
            expect(mbToBytes(0.001)).equals(1_048);
            expect(mbToBytes(1024)).equals(1_073_741_824);
        });
    });

    describe('bytesToString()', () => {
        it.each([
            [0, '0B'],
            [0.5, '0B'],
            [0.9, '0B'],
            [100, '100B'],
            [100.25, '100.25B'],
            [100.998, '101B'],
            [512, '512B'],
            [1000, '1000B'],
            [1024, '1KiB'],
            [5068, '4.95KiB'],
            [10_000, '9.77KiB'],
            [10_240, '10KiB'],
            [11_864, '11.59KiB'],
            [1_000_000, '976.56KiB'],
            [1_024_000, '1000KiB'],
            [1_025_000, '1000.98KiB'],
            [1_048_576, '1MiB'],
            [1_356_000, '1.29MiB'],
            [1_000_000_000, '953.67MiB'],
            [1_070_000_100, '1020.43MiB'],
            [1_073_741_824, '1GiB'],
            [1_678_342_000, '1.56GiB'],
            [1_000_000_000_000, '931.32GiB'],
            [1_099_511_627_776, '1TiB'],
        ])('should format %d bytes as "%s"', function (input, output) {
            expect(bytesToString(input)).equals(output);
        });
    });

    describe('ip()', () => {
        it('should format an IPv4 address', () => {
            expect(ip('127.0.0.1')).equals('127.0.0.1');
        });

        it('should format an IPv4 address with a port', () => {
            expect(ip('127.0.0.1:25565')).equals('[127.0.0.1:25565]');
        });

        it('should format an IPv6 address', () => {
            expect(ip('::1')).equals('[::1]');
            expect(ip(':::1')).equals('[:::1]');
            expect(ip('2001:db8::')).equals('[2001:db8::]');

            expect(ip('[::1]')).equals('[::1]');
            expect(ip('[2001:db8::]')).equals('[2001:db8::]');
        });

        it('should format an IPv6 address with a port', () => {
            expect(ip('[::1]:25565')).equals('[::1]:25565');
            expect(ip('[2001:db8::]:25565')).equals('[2001:db8::]:25565');
        });

        it('should handle random inputs', () => {
            expect(ip('1')).equals('1');
            expect(ip('foobar')).equals('foobar');
        });
    });
});
