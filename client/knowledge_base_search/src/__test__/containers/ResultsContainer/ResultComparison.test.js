import React from 'react';
import ReactDOM from 'react-dom';
import ResultComparison from '../../../containers/ResultsContainer/ResultComparison';
import ResultBox from '../../../containers/ResultsContainer/ResultBox';
import { shallow } from 'enzyme';

describe('<ResultComparison />', () => {
  let wrapper;
  const props = {
    passages: [
      {
        document_id: '1',
        passage_text: 'a passage',
        rank: 0
      },
      {
        document_id: '1',
        passage_text: 'another passage',
        rank: 1
      }
    ],
    passageFullResult: {
      id: '1',
      text: 'a good answer with a passage and another passage'
    },
    index: 0
  }

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ResultComparison {...props} />, div);
  });

  it('has 2 <ResultBox /> with expected text containing highlighted passages', () => {
    wrapper = shallow(<ResultComparison {...props} />);

    const resultBoxes = wrapper.find(ResultBox);
    const expectedAnswer = props.passageFullResult.text;
    const expectedPassage = [
      'a good answer with ',
      (
        <span key={'passage_1'}>
          <span className='passage_rank--span'>
            { 1 }
          </span>
          <b>
            { 'a passage' }
          </b>
        </span>
      ),
      ' and ',
      (
        <span key={'passage_2'}>
          <span className='passage_rank--span'>
            { 2 }
          </span>
          <b>
            { 'another passage' }
          </b>
        </span>
      )
    ];
    expect(resultBoxes).toHaveLength(2);
    expect(resultBoxes.at(0).props().result_text).toEqual(expectedAnswer);
    expect(resultBoxes.at(1).props().result_text).toEqual(expectedPassage);
  });

  it('has 2 titles', () => {
    wrapper = shallow(<ResultComparison {...props} />);

    const titles = wrapper.find('.results_comparison_content--div h5');

    expect(titles).toHaveLength(2);
    expect(titles.at(0).text()).toEqual('Standard search');
    expect(titles.at(1).text()).toEqual('Passage search');
  });

  describe('when index is not 0', () => {
    beforeEach(() => {
      const props_with_nonzero_index = Object.assign({}, props, {
        index: 1
      });

      wrapper = shallow(<ResultComparison {...props_with_nonzero_index} />);
    });

    it('does not show titles', () => {
      const titles = wrapper.find('.results_comparison_header--div h4');

      expect(titles).toHaveLength(0);
      expect(wrapper.text()).not.toContain('Standard Search');
      expect(wrapper.text()).not.toContain('Passage Search');
    });
  });

  describe('when calling highlightPassages', () => {
    describe('and there is only one passage at the beginning', () => {
      beforeEach(() => {
        const props_with_begin_passage = Object.assign({}, props, {
          passages: [
            {
              passage_text: 'beginning passage',
              rank: 0
            }
          ],
          passageFullResult: {
            text: 'beginning passage with other stuff'
          }
        })
        wrapper = shallow(<ResultComparison {...props_with_begin_passage} />);
      });

      it('returns expected html', () => {
        const expectedHtml = [
          (
            <span key={'passage_1'}>
              <span className='passage_rank--span'>
                { 1 }
              </span>
              <b>
                { 'beginning passage' }
              </b>
            </span>
          ),
          ' with other stuff'
        ];
        const actual = wrapper.instance().highlightPassages();
        expect(actual).toEqual(expectedHtml);
      });
    });

    describe('and there is only one passage at the end', () => {
      beforeEach(() => {
        const props_with_end_passage = Object.assign({}, props, {
          passages: [
            {
              passage_text: 'ending passage',
              rank: 0
            }
          ],
          passageFullResult: {
            text: 'some stuff before ending passage'
          }
        })
        wrapper = shallow(<ResultComparison {...props_with_end_passage} />);
      });

      it('returns expected html', () => {
        const expectedHtml = [
          'some stuff before ',
          (
            <span key={'passage_1'}>
              <span className='passage_rank--span'>
                { 1 }
              </span>
              <b>
                { 'ending passage' }
              </b>
            </span>
          )
        ];
        const actual = wrapper.instance().highlightPassages();
        expect(actual).toEqual(expectedHtml);
      });
    });
  });

  describe('when calling replaceNewlines', () => {
    it('returns expected html', () => {
      const expected = [
        (
          <span key={'newline_0'}>
            {'text'}
            <br />
          </span>
        ),
        (
          <span key={'newline_1'}>
            {'newline'}
            { false }
          </span>
        )
      ];
      const actual = wrapper.instance().replaceNewlines('text\nnewline');

      expect(actual).toEqual(expected);
    });
  });
});
