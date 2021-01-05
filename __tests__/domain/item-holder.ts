// import { Item } from '../../src/domain/item';
// import { ItemHolder } from '../../src/domain/item-holder';

// describe('ItemHolder', () => {

//   const itemHolder = new ItemHolder();
//   const item1 = new Item({kinds: 'a', quantity: 4});
//   const item2 = new Item({kinds: 'b', quantity: 2});
//   const item3 = new Item({kinds: 'c', quantity: 2});

//   beforeEach(() => {
//     itemHolder.clear();
//   });

//   test('addItems and removeItems', () => {
//     expect(itemHolder.addItem('a', item1)).toBeUndefined();
//     expect(itemHolder.addItem('b', item2)).toBeUndefined();
//     expect(itemHolder.addItems([['c', [item3]]])).toBeUndefined();

//     expect(
//       itemHolder.removeItems('a')
//                      .equals([['a', ['a']]])
//     ).toBeTruthy();

//     expect(
//       itemHolder.removeItems(['a', 'b'])
//                      .equals([['a', ['a']], ['b', ['b']]])
//     ).toBeTruthy();

//     expect(itemHolder.removeItems([['a', 2], 'b', ['c', 2]])
//                           .equals([
//                             ['a', [{kinds: 'a', quantity: 2}]],
//                             ['b', ['b']],
//                             ['c', [{kinds: 'c', quantity: 2}]]
//                           ])
//     ).toBeTruthy();

//     expect(() => itemHolder.removeItems('a')).toThrow('Missing item');

//     expect(() => itemHolder.removeItems('b')).toThrow('Missing item');

//     expect(() => itemHolder.removeItems('c')).toThrow('Missing item');
//   });

//   // test('getProportions()', () => {
//   // });
// });
