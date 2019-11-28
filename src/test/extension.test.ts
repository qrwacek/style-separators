import * as assert from 'assert';
import { createSeparator } from '../extension';

suite("createSeparator", function () {
    test("should create unindented separator with empty title by default", function() {
        const result = createSeparator();
        const expected = "// \n// ---------------------------------------------------------------------------------------------------------------------\n";
        assert.equal(expected, result);
    });

    test("should create separator with title", function() {
        const result = createSeparator('foo');
        const expected = "// foo\n// ---------------------------------------------------------------------------------------------------------------------\n";
        assert.equal(expected, result);
    });

    test("should create indented separator with title", function() {
        const result = createSeparator('bar', 4);
        const expected = "// bar\n    // -----------------------------------------------------------------------------------------------------------------\n    ";
        assert.equal(expected, result);
    });

    test("should create indented separator with title and top space", function() {
        const result = createSeparator('baz', 2, true);
        const expected = "\n  // baz\n  // -------------------------------------------------------------------------------------------------------------------\n  ";
        assert.equal(expected, result);
    });
});
