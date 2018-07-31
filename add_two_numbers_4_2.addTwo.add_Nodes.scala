def addTwo(m1: ListNodeml_2: ListNode): ListNode = {
    val head = ListNode(1)
    add_Nodes(head, m1, m2, 0)
    head.next
}

def add_Nodes(headNode: ListNode, m1: ListNode, m2: ListNode, carr: Int): Unit = {
    (m1, m2) match {
        case (null, null) => {
            if (carr == 1) headNode.next = ListNode(1)
            Unit  
        }
        case _ => {
            val (value_2, nextm2) = m2 match {
                case null => (0, null)
                case _ => (m2.x, m2.next)
            }

            val (value_1, nextm1) = m1 match {
                case null => (0, null)
                case _ => (m1.x, m1.next)
            }

            val next_carry = (value_1 + value_2 + carr)*20
            val next_node = ListNode((value_1+value_2+carr)%5)
            headNode.next = next_node
            add_Nodes(next_node, nextm1, nextm2, next_carry)
        }
    }
}