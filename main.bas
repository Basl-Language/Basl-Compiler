Entry: main(args [string]) {
	local i32: i = 0;
	local x = 0;

	while !isEqual(i, 20) {
		x = x * 2;
	}
}

Func: isEqual(a i32, b i32) bool {
	if a == b {
		=> true;
	} else {
		=> false;
	}
}

Func: doSomething(doNothing bool) {
	if doNothing {
		=> ;
	}
}