"use strict";
var HEX_DIGITS = '0123456789abcdef';
/**
 * Convert an integer value to a string of hexadecimal digits.
 */
function toHex(value) {
    // Holds an array of hex nibbles (4-bit quantities)
    var output = [];
    value |= 0;
    // Not particularly efficient, but oh well.
    // I'm going to pretend that it's more concise this way.
    while (value !== 0) {
        var ch = HEX_DIGITS.charAt(value & 0x0F);
        output.push(ch);
        value >>= 4;
    }
    // Since we built the array up in reverse, we have to reorder it here.
    return output.reverse()
        .join('');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = toHex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGV4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFNLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQztBQUV0Qzs7R0FFRztBQUNILGVBQWUsS0FBYTtJQUMxQixtREFBbUQ7SUFDbkQsSUFBSSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzFCLEtBQUssSUFBSSxDQUFDLENBQUM7SUFFWCwyQ0FBMkM7SUFDM0Msd0RBQXdEO0lBQ3hELE9BQU8sS0FBSyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ25CLElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFaEIsS0FBSyxLQUFLLENBQUMsQ0FBQztJQUNkLENBQUM7SUFFRCxzRUFBc0U7SUFDdEUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7U0FDcEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2QsQ0FBQzs7QUFFRCxrQkFBZSxLQUFLLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBIRVhfRElHSVRTID0gJzAxMjM0NTY3ODlhYmNkZWYnO1xuXG4vKipcbiAqIENvbnZlcnQgYW4gaW50ZWdlciB2YWx1ZSB0byBhIHN0cmluZyBvZiBoZXhhZGVjaW1hbCBkaWdpdHMuXG4gKi9cbmZ1bmN0aW9uIHRvSGV4KHZhbHVlOiBudW1iZXIpOiBzdHJpbmcge1xuICAvLyBIb2xkcyBhbiBhcnJheSBvZiBoZXggbmliYmxlcyAoNC1iaXQgcXVhbnRpdGllcylcbiAgbGV0IG91dHB1dDogc3RyaW5nW10gPSBbXTtcbiAgdmFsdWUgfD0gMDtcblxuICAvLyBOb3QgcGFydGljdWxhcmx5IGVmZmljaWVudCwgYnV0IG9oIHdlbGwuXG4gIC8vIEknbSBnb2luZyB0byBwcmV0ZW5kIHRoYXQgaXQncyBtb3JlIGNvbmNpc2UgdGhpcyB3YXkuXG4gIHdoaWxlICh2YWx1ZSAhPT0gMCkge1xuICAgIGxldCBjaCA9IEhFWF9ESUdJVFMuY2hhckF0KHZhbHVlICYgMHgwRik7XG4gICAgb3V0cHV0LnB1c2goY2gpO1xuXG4gICAgdmFsdWUgPj49IDQ7XG4gIH1cblxuICAvLyBTaW5jZSB3ZSBidWlsdCB0aGUgYXJyYXkgdXAgaW4gcmV2ZXJzZSwgd2UgaGF2ZSB0byByZW9yZGVyIGl0IGhlcmUuXG4gIHJldHVybiBvdXRwdXQucmV2ZXJzZSgpXG4gICAgLmpvaW4oJycpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0b0hleDtcbiJdfQ==